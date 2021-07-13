function terminate(server, options = { timeout: 500 }) {
  // Exit function
  const exit = (code) => () => {
    process.exit(code);
  };

  return (code, reason) => (err, promise) => {
    if (err && err instanceof Error) {
      // Log error information, use a proper logging library here :)
      console.log(err.message, err.stack);
    }

    // Attempt a graceful shutdown
    server.close(exit(code));
    setTimeout(exit(code), options.timeout).unref();
  };
}

module.exports = terminate;
