<?php

	$completePresentationName = $_GET['presentation'];
	$path = explode("/", $completePresentationName);
	$presentationName = end($path);	
	$archiveFile = "./pdf/" . $completePresentationName . "/" . $presentationName . ".tar.bz2";
	$pdfFile = "./pdf/" . $completePresentationName . "/" . $presentationName . ".pdf";

	if (file_exists($archiveFile)) {
		$file = $archiveFile;
		header("Content-Type: application/x-tar; name=\"$presentationName\".tar.bz2\"");
	} else if (file_exists($pdfFile)) {
		$file = pdfFile;
		header("Content-Type: application/pdf; name=\"$presentationName\".pdf\"");
	} else {
		echo "File not found.";
		exit();
	}

	$fileSize = filesize($file);
	header("Accept-Ranges: bytes");
	header("Content-Transfer-Encoding: binary");
	header("Content-Length: $fileSize");
	header("Expires: 0");
	header("Cache-Control: no-cache, must-revalidate");
	header("Pragma: no-cache");
	readfile("$file");
	exit();

?>
