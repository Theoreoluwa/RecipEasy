module.exports = {
  apps: [
    {
      name: "backend",
      script: "index.js",
      cwd: "./server",
      interpreter: "node",
      env: {
        NODE_ENV: "development",
        PORT: 5002
      }
    },
    {
      name: "frontend",
      script: "npm",
      args: "start",
      cwd: "./frontend",
      interpreter: "cmd.exe",
      interpreter_args: "/c",
      env: {
        PORT: 3000
      }
    }
  ]
};
