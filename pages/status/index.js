import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  console.log(responseBody)
  return responseBody
}

function UpdateAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updateAtText = "Carregando...";
  let max_connections = "Carregando...";
  let opened_connections = "Carregando...";
  let version = "Carregando...";
  if (!isLoading && data) {
    updateAtText = new Date(data.updated_at).toLocaleString();
    max_connections = data.dependencies.database.max_connections;
    opened_connections = data.dependencies.database.opened_connections;
    version = data.dependencies.database.version;
  }

  return (
    <div >
      <h4>Última atualização: {updateAtText}</h4>
      <div>Conexões Maximas: {max_connections}</div>
      <div>Conexões Abertas: {opened_connections}</div>
      <div>Versão: {version}</div>
    </div>
  )
}

export default function StatesPage() {

  return (
    <>
      <div>
        <h1>Status</h1>
        <div>
          <UpdateAt />
        </div>
      </div>
    </>
  )
}