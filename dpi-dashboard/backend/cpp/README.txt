Place your compiled DPI engine binary in this folder.

  Windows:  cpp/dpi_engine.exe
  Linux/Render: cpp/dpi_engine   (must be chmod +x)

Set DPI_ENGINE_PATH in your .env to point at whichever binary you place here.
This backend never modifies or rebuilds the engine — it only spawns it as a
child process and reads its stdout/stderr.
