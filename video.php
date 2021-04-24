<?php
header("Content-Type: application/json");
/**
 * video
 * metadata
 */
$UPLOADS_DIRECTORY = "uploads";
$VIDEO_EXTENSION = "webm";

// Validate the request
$validationResult = validateRequest();
if ($validationResult['status'] == 'error') {
    echo json_encode($validationResult, true);
    return;
}

// Check and create upload folder
try {
    createFolder($UPLOADS_DIRECTORY);
} catch (Exception $e) {
    echo json_encode([
        "message" => "Something went wrong about create uploads folder",
        "status" => "error"
    ]);
}

// Create unique target folder
try {
    $targetFolder  = createUniqueFolder($UPLOADS_DIRECTORY);
} catch (Exception $e) {
    echo json_encode([
        "message" => "Something went wrong create unique folder",
        "status" => "error"
    ]);
}


// Upload the files
try {
    $videoFile = $_FILES['video'];
    $metaFile = $_FILES['metadata'];
    $uploadResult = uploadFiles($targetFolder, $_FILES['video'], $_FILES['metadata']);
    echo json_encode($uploadResult, true);
    return;
} catch (Exception $e) {
    echo json_encode([
        "message" => "Something went wrong about file upload",
        "status" => "error"
    ]);
}



// Validate the request data
function validateRequest()
{
    $messages = [];
    $status = 'error';

    if (!isset($_FILES['video'])) {
        $messages[] = 'video field is required as a file';
    } else {
        $extension = getExtension($_FILES['video']['name']);
        if ($extension !== 'webm') {
            $messages[] = 'video field is required as a .webm';
        }
    }

    if (!isset($_FILES['metadata'])) {
        $messages[] = 'metadata field is required as a file';
    } else {
        $extension = getExtension($_FILES['metadata']['name']);
        if ($extension !== 'json') {
            $messages[] = 'metadata field is required as a .json';
        }
    }

    if (empty($messages)) {
        $status = 'success';
    }

    return ['message' =>  join(', ', ($messages)), 'status' => $status];
}

// Get file extension
function getExtension($filename)
{
    return strtolower(pathinfo(basename($filename), PATHINFO_EXTENSION));
}

// Create the folder if it does not exists
function createFolder($folder = '')
{
    if (file_exists($folder)) {
        return;
    }

    mkdir($folder);
    return;
}

// Create unique folder
function createUniqueFolder($parentDirectory)
{
    $name = uniqid();
    $dir = $parentDirectory . '/' . $name;
    if (!file_exists($dir)) {
        if (mkdir($dir) === true) {
            return $dir;
        }
    }
    return createUniqueFolder($parentDirectory);
}

// Upload video and meta file in target folder
function uploadFiles($targetFolder, $videoFile, $metaFile)
{
    $status = 'error';
    $messages = [];

    $targetVideoFile = $targetFolder . '/' . basename($videoFile['name']);
    if (!move_uploaded_file($videoFile['tmp_name'], $targetVideoFile)) {
        $messages[] = 'Sorry, there was an error uploading video file.';
    }

    $targetMetaFile = $targetFolder . '/' . basename($metaFile['name']);
    if (!move_uploaded_file($metaFile['tmp_name'], $targetMetaFile)) {
        $messages[] = 'Sorry, there was an error uploading metadata file.';
    }

    if (empty($messages)) {
        $status = 'success';
        $messages[] = 'File uploded successfully';
    }
    return ['message' =>  join(', ', ($messages)), 'status' => $status];
}
