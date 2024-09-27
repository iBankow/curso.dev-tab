import database from "infra/database.js";

export default async function status(request, response) {
  const updateAt = new Date().toISOString();
  const version = await database.query("SHOW server_version;");
  const maxConnections = await database.query("SHOW max_connections;");
  const activityConnection = await database.query(
    "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    [process.env.POSTGRES_DB],
  );

  response.status(200).json({
    updated_at: updateAt,
    api: "confia",
    dependencies: {
      database: {
        version: version.rows[0].server_version,
        max_connections: parseInt(maxConnections.rows[0].max_connections),
        opened_connections: activityConnection.rows[0].count,
      },
    },
  });
}
