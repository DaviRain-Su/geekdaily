import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://101.33.75.240:1337/api/v1/geekdailies';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('pagination[page]') || '1';
    const pageSize = searchParams.get('pagination[pageSize]') || '25';
    const sort = searchParams.get('sort') || 'id:desc';

    // Construct the URL with query parameters
    const url = new URL(API_BASE_URL);
    url.searchParams.append('pagination[page]', page);
    url.searchParams.append('pagination[pageSize]', pageSize);
    url.searchParams.append('sort', sort);

    // Fetch data from the external API
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Don't cache in development, cache for 5 minutes in production
      next: { 
        revalidate: process.env.NODE_ENV === 'development' ? 0 : 300 
      },
    });

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch data from API' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the data with proper CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}