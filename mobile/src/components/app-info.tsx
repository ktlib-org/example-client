import { SystemService } from "core/api";
import { API_URL, APP_NAME } from "core/constants";
import { useInitialEffect } from "core/react-utils";
import { Box } from "native-base";
import { useState } from "react";
import { Text } from "react-native";

const AppInfo = () => {
  const [serverVersion, setServerVersion] = useState(null as string);

  useInitialEffect(async () => {
    const result = await SystemService.status();
    setServerVersion(result.version);
  });

  return (
    <Box alignSelf="center">
      <Text>Hello from {APP_NAME}!</Text>
      <Text>API: {API_URL}</Text>
      <Text>Server Version: {serverVersion}</Text>
    </Box>
  );
};

export default AppInfo;
