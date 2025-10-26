import { useState } from "react";
import { Box, Button, Text, useToast } from "@chakra-ui/react";
import { executeCode } from "../api";

const Output = ({ editorRef, language }) => {
  const toast = useToast();
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      setIsError(false);

      // Call backend
      const response = await executeCode(language, sourceCode);

      // Adjust according to your backend structure
      const run = response?.data?.run || response?.run;

      if (!run || !run.output) {
        setOutput(["No output received"]);
        return;
      }

      const outputStr =
        typeof run.output === "string" ? run.output : JSON.stringify(run.output);
      setOutput(outputStr.split("\n"));
    } catch (err) {
      console.error(err);
      setIsError(true);
      setOutput([err.message || "Error executing code"]);
      toast({
        title: "An error occurred.",
        description: err.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w="50%">
      <Text mb={2} fontSize="lg">
        Output
      </Text>
      <Button
        variant="outline"
        colorScheme="green"
        mb={4}
        isLoading={isLoading}
        onClick={runCode}
      >
        Run Code
      </Button>
      <Box
        height="75vh"
        p={2}
        color={isError ? "red.400" : ""}
        border="1px solid"
        borderRadius={4}
        borderColor={isError ? "red.500" : "#333"}
        overflowY="auto"
      >
        {output.length > 0
          ? output.map((line, i) => <Text key={i}>{line}</Text>)
          : 'Click "Run Code" to see the output here'}
      </Box>
    </Box>
  );
};

export default Output;
