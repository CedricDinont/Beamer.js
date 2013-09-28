<?php

	$completePresentationName = $_GET['presentation'];
	$pathElements = explode("/", $completePresentationName);
	$presentationName = end($pathElements);	
	$archiveFile = "./pdf/" . $completePresentationName . "/" . $presentationName . ".tar.bz2";
	$pdfFile = "./pdf/" . $completePresentationName . "/" . $presentationName . ".pdf";

	$downloadFilename = date('Y_m_d') . "-" . implode("_", $pathElements);

	if (file_exists($archiveFile)) {
		$file = $archiveFile;
		header("Content-Type: application/x-tar;");
                header('Content-Disposition: attachment; filename="' . $downloadFilename . '.tar.bz2"');
	} else if (file_exists($pdfFile)) {
		$file = $pdfFile;
		header("Content-Type: application/pdf;");
		header('Content-Disposition: inline; filename="' . $downloadFilename . '.pdf"');
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
