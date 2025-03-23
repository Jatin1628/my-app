import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Extract query parameter from the request URL
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required.' },
      { status: 400 }
    );
  }

  // Retrieve API credentials from environment variables
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CSE_ID;
  if (!apiKey || !cx) {
    return NextResponse.json(
      { error: 'Server configuration error: Missing API credentials.' },
      { status: 500 }
    );
  }

  try {
    // Include &num=1 to limit the results to one item
    const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(q)}&num=1`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'Google API error', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Check if a result exists and extract its snippet
    if (data.items && data.items.length > 0) {
      const topResult = data.items[0];
      const answer = {
        title: topResult.title,
        link: topResult.link,
        snippet: topResult.snippet
      };
      return NextResponse.json({ answer });
    } else {
      return NextResponse.json(
        { error: 'No results found.' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error calling Google Custom Search API:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
