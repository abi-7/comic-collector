import type { Comic, GoogleBooksResponse, MetronIssue } from "./comicTypes";

// Function to fetch comic data from Google Books API using ISBN
const fetchFromGoogleBooks = async (barcode: string): Promise<Comic | null> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${barcode}`
    );

    if (!response.ok) return null;

    const data: GoogleBooksResponse = await response.json();

    if (!data.items || data.items.length === 0) return null;

    const book = data.items[0];
    const volumeInfo = book.volumeInfo;

    return {
      id: book.id,
      title: volumeInfo.title,
      issue: volumeInfo.publishedDate?.split("-")[0] || "N/A", // Use year as issue
      coverImage:
        volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") ||
        "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
      publisher: volumeInfo.publisher || "Unknown Publisher",
      barcode,
      description: volumeInfo.description,
      creators: volumeInfo.authors,
      releaseDate: volumeInfo.publishedDate,
      source: "Google Books",
    };
  } catch (error) {
    console.error("Google Books API error:", error);
    return null;
  }
};

// Function to fetch comic data from Metron API using UPC
const fetchFromMetron = async (barcode: string): Promise<Comic | null> => {
  try {
    // Try searching by UPC first
    const searchResponse = await fetch(
      `https://metron.cloud/api/issue/?upc=${barcode}`
    );

    if (!searchResponse.ok) return null;

    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) return null;

    const issue: MetronIssue = searchData.results[0];

    return {
      id: issue.id.toString(),
      title: issue.series.name,
      issue: `#${issue.number}`,
      coverImage:
        issue.image ||
        "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
      publisher: issue.publisher.name,
      barcode,
      description: issue.desc,
      creators: issue.credits?.map((c) => `${c.creator} (${c.role})`),
      releaseDate: issue.cover_date,
      source: "Metron",
    };
  } catch (error) {
    console.error("Metron API error:", error);
    return null;
  }
};

/**
 * Main function: Try multiple APIs in sequence until we get data
 */
export const fetchComicByBarcode = async (
  barcode: string
): Promise<Comic | null> => {
  console.log(`🔍 Searching for comic with barcode: ${barcode}`);

  // Try Google Books first (fastest, most reliable for TPBs)
  console.log("Trying Google Books...");
  let comic = await fetchFromGoogleBooks(barcode);
  if (comic) {
    console.log("Found on Google Books");
    return comic;
  }

  // Try Metron second (best for single issues)
  console.log("Trying Metron...");
  comic = await fetchFromMetron(barcode);
  if (comic) {
    console.log("Found on Metron");
    return comic;
  }

  console.log("Comic not found in any database");
  return null;
};

/**
 * Helper function to format barcode for different API requirements
 */
export const formatBarcode = (rawBarcode: string): string => {
  // Remove any spaces or dashes
  const formatted = rawBarcode.replace(/[\s-]/g, "");

  // Ensure it's the right length (UPC is typically 12 digits, ISBN-13 is 13)
  // Most comic book barcodes are UPC (12 digits)

  return formatted;
};
