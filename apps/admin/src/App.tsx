import React, { useEffect, useState, useRef } from "react";
import { Admin, AuthProvider, DataProvider, Resource } from "react-admin";
import Keycloak from "keycloak-js";
import {
  keycloakClient,
  keycloakAuthProvider,
} from "./auth-provider/ra-auth-keycloak";
import buildGraphQLProvider from "./data-provider/graphqlDataProvider";
import { theme } from "./theme/theme";
import Login from "./Login";
import "./App.scss";
import Dashboard from "./pages/Dashboard";
import { UserList } from "./user/UserList";
import { UserCreate } from "./user/UserCreate";
import { UserEdit } from "./user/UserEdit";
import { UserShow } from "./user/UserShow";

const App = (): React.ReactElement => {
  const [dataProvider, setDataProvider] = useState<DataProvider | null>(null);
  const [keycloak, setKeycloak] = useState<Keycloak | null>();
  const authProvider = useRef<AuthProvider | null>();

  useEffect(() => {
    buildGraphQLProvider
      .then((provider: any) => {
        setDataProvider(() => provider);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const initKeyCloakClient = async () => {
      await keycloakClient.init({
        onLoad: "login-required",
      });
      authProvider.current = keycloakAuthProvider(keycloakClient, {});
      setKeycloak(keycloakClient);
    };
    if (!keycloak) {
      initKeyCloakClient();
    }
  }, [keycloak]);

  if (!dataProvider || !authProvider.current) {
    return <div>Loading</div>;
  }

  return (
    <div className="App">
      <Admin
        title={"my service"}
        dataProvider={dataProvider}
        authProvider={authProvider.current}
        theme={theme}
        dashboard={Dashboard}
        loginPage={Login}
      >
        <Resource
          name="User"
          list={UserList}
          edit={UserEdit}
          create={UserCreate}
          show={UserShow}
        />
      </Admin>
    </div>
  );
};

export default App;
