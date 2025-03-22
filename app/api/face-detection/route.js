import { spawn } from 'child_process';

export async function GET(request) {
  try {
    console.log('Starting face detection...');
    const pythonProcess = spawn('python', ['face_detection_live.py']);

    // Stream the output from the Python script
    const stream = new ReadableStream({
      start(controller) {
        pythonProcess.stdout.on('data', (data) => {
          const message = data.toString();
          console.log('Python Output:', message);
          controller.enqueue(`data: ${message}\n\n`);
        });

        pythonProcess.stderr.on('data', (data) => {
          console.error('Python Error:', data.toString());
        });

        pythonProcess.on('close', (code) => {
          console.log(`Python process exited with code ${code}`);
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error starting face detection:', error);
    return new Response('Failed to start face detection', { status: 500 });
  }
}