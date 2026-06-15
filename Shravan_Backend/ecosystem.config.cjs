module.exports = {
  apps: [
    {
      name: "shravan-app",
      script: "cmd.exe",
      args: ["/c", "npm", "run", "start"],
      interpreter: "none",
      cwd: __dirname,
    },
  ],
};
