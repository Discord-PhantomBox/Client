import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  
  console.log('Proxy request for URL:', url);
  
  if (!url) {
    console.error('No URL parameter provided');
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    console.log('Fetching URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Failed to fetch URL:', url, 'Status:', response.status);
      return NextResponse.json({ error: `Failed to fetch: ${response.status}` }, { status: response.status });
    }
    
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    console.log('Successfully fetched:', url, 'Content-Type:', contentType, 'Size:', contentLength);
    
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Proxy error for URL:', url, error);
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
} 