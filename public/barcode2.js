$(document).ready(function() {
    // Function to initialize the camera access and QR code scanning process
    function startScanner() {
        $('#qrModal').modal('show'); // Show the modal
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(function(str) {
                stream = str; // Assign the camera stream to the global variable
                // Display the camera stream in the video element
                const videoElement = document.getElementById('videoElement');
                videoElement.srcObject = stream;

                // Initialize the QR code scanner
                const scanner = setInterval(function() {
                    // Capture a frame from the video stream
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = videoElement.videoWidth;
                    canvas.height = videoElement.videoHeight;
                    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

                    // Decode the QR code from the captured frame
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, canvas.width, canvas.height);

                    // If a QR code is detected within the detection area and the ratio is greater than 0.30,
                    // fill the input field with the scanned code and hide the modal
                    if (code && isInDetectionArea(code.location)) {
                        const qrCodeArea = calculateQRCodeArea(code.location);
                        const detectionArea = calculateDetectionArea();
                        const ratio = qrCodeArea / detectionArea;

                        if (0.4 > ratio > 0.80) {
                            document.getElementById('barcodeId').value = code.data;
                            clearInterval(scanner); // Stop the scanning process
                            stream.getTracks().forEach(track => track.stop()); // Stop the camera stream
                            

                            $('#qrModal').modal('hide'); // Hide the modal
                            $('#barcodeForm').submit(); // Submit the form
                        }
                    }
                }, 100);
            })
            .catch(function(error) {
                console.error('Error accessing camera:', error);
            });
    }

    // Function to stop the camera stream
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }

    // Function to calculate the detection area
    function calculateDetectionArea() {
        const detectionArea = document.getElementById('detectionArea').getBoundingClientRect();
        return detectionArea.width * detectionArea.height;
    }

    // Function to check if a point is within the detection area
    function isInDetectionArea(location) {
        const detectionArea = document.getElementById('detectionArea').getBoundingClientRect();
        const minX = detectionArea.left;
        const minY = detectionArea.top;
        const maxX = minX + detectionArea.width;
        const maxY = minY + detectionArea.height;
        const point = location.topLeftCorner;
        return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
    }

    // Function to calculate the area of the QR code bounding box
    function calculateQRCodeArea(location) {
        const width = location.bottomRightCorner.x - location.topLeftCorner.x;
        const height = location.bottomRightCorner.y - location.topLeftCorner.y;
        return width * height;
    }

    // Event listener for the scan button
    document.getElementById('scanButton').addEventListener('click', function() {
        startScanner();
    });

    // Event listener for the modal hidden event
    $('#qrModal').on('hidden.bs.modal', function () {
        stopCamera(); // Stop the camera when the modal is completely hidden
    });
});
