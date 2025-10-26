import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import { exec } from "child_process";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/execute", (req, res) => {
  const { files } = req.body;
  if (!files || !files[0]?.content) {
    return res.status(400).json({ run: { output: "No code provided" } });
  }

  const code = files[0].content;
  const fileName = "Main.java";
  const classFile = "Main.class";

  const cleanup = () => {
    if (fs.existsSync(fileName)) fs.unlinkSync(fileName);
    if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
  };

  try {
    fs.writeFileSync(fileName, code);

    // Compile
    exec(`javac ${fileName}`, (compileErr, stdout, stderr) => {
      if (compileErr) {
        // Always send a string
        const output = stderr?.toString() || compileErr.message?.toString() || "Compilation failed";
        cleanup();
        return res.json({ run: { output } });
      }

      // Run Java
      exec(`java Main`, (runErr, runStdout, runStderr) => {
        const output = runStdout?.toString() || runStderr?.toString() || runErr?.message?.toString() || "No output";
        cleanup();
        return res.json({ run: { output } });
      });
    });
  } catch (err) {
    cleanup();
    return res.json({ run: { output: err.message || "Unknown server error" } });
  }
});

app.listen(5000, () => console.log("Java backend running on port 5000"));
