<?php

session_start();

spl_autoload_register(function (string $className)
{
    $includePaths = [
        "./classes",
        "./"
    ];
    foreach ($includePaths as $path) {
        $file = "${path}/" . str_replace("\\", "/", $className) . ".php";
        if (file_exists($file)) {
            require_once $file;
            break;
        }
    }

    // Remove or comment out the debug echo statements
    // echo "Loaded class: $className from file: $file\n";
    // echo "Failed to load class: $className from file: $file\n";
});

set_exception_handler(function (Throwable $e)
{
    if ($e instanceof DuplicateUserException) {
        http_response_code(400);
    } else {
        http_response_code(501);
    }
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
});
