import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "../constants";

const ACTIVE_COLOR = "blue.400";

const LanguageSelector = ({ language = "java", onSelect }) => {
  const lang = "java";
  const version = LANGUAGE_VERSIONS[lang];

  return (
    <Box ml={2} mb={4}>
      <Text mb={2} fontSize="lg">
        Start Coding in {language.toUpperCase()}
      </Text>
      <Menu isLazy>
        <MenuButton as={Button}>{language}</MenuButton>
        <MenuList bg="#110c1b">
          <MenuItem
            key={lang}
            color={ACTIVE_COLOR}
            bg="gray.900"
            _hover={{
              color: ACTIVE_COLOR,
              bg: "gray.900",
            }}
            onClick={() => onSelect(lang)}
          >
            {lang}
            &nbsp;
            <Text as="span" color="gray.600" fontSize="sm">
              ({version})
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
