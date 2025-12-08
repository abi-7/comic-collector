import type { Comic, GoogleBooksResponse, MetronIssue } from "./comicTypes";

/**
 * Extract publisher from comic title or description
 * Comics often have publisher info in the title
 */
const extractPublisher = (
  title: string,
  description?: string,
  publisher?: string
): string => {
  if (publisher && publisher !== "Unknown Publisher") {
    return publisher;
  }

  // Common comic publishers
  const publishers = [
    "DC Comics",
    "Marvel Comics",
    "Image Comics",
    "Dark Horse Comics",
    "IDW Publishing",
    "Boom! Studios",
    "Dynamite Entertainment",
    "Oni Press",
    "Valiant Comics",
    "Aftershock Comics",
  ];

  // Check title for publisher mentions
  const titleLower = title.toLowerCase();
  const descLower = (description || "").toLowerCase();
  const combined = `${titleLower} ${descLower}`;

  // Check for full publisher names
  for (const pub of publishers) {
    if (combined.includes(pub.toLowerCase())) {
      return pub;
    }
  }

  // Check for DC Comics indicators
  if (
    combined.includes("dc's") ||
    combined.includes("dc comics") ||
    combined.includes("dc universe") ||
    combined.includes("absolute universe") || // DC's Absolute line
    combined.includes("justice league") ||
    combined.includes("batman") ||
    combined.includes("superman") ||
    combined.includes("wonder woman") ||
    combined.includes("green lantern") ||
    combined.includes("the flash") ||
    combined.includes("aquaman")
  ) {
    return "DC Comics";
  }

  // Check for Marvel Comics indicators
  if (
    combined.includes("marvel") ||
    combined.includes("avengers") ||
    combined.includes("x-men") ||
    combined.includes("spider-man") ||
    combined.includes("iron man") ||
    combined.includes("captain america") ||
    combined.includes("fantastic four") ||
    combined.includes("hulk") ||
    combined.includes("thor")
  ) {
    return "Marvel Comics";
  }

  // Check for Image Comics indicators
  if (
    combined.includes("image comics") ||
    combined.includes("spawn") ||
    combined.includes("the walking dead") ||
    combined.includes("saga") ||
    combined.includes("invincible")
  ) {
    return "Image Comics";
  }

  return publisher || "Unknown Publisher";
};

/**
 * Extract writer from description text
 * Looks for common patterns like "written by", "writer:", "by [author]", etc.
 */
const extractWriter = (
  description?: string,
  authors?: string[]
): string | undefined => {
  if (!description) {
    return authors?.[0]; // Fallback to first author
  }

  // Common patterns for writer attribution
  const writerPatterns = [
    /written by\s+(?:award-winning\s+)?(?:author\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /writer:?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /script(?:ed)?\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /story\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+\(/i, // "by Jeff Lemire (Sweet Tooth)"
  ];

  for (const pattern of writerPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Fallback to first author from authors array
  return authors?.[0];
};

/**
 * Extract artist from description text
 * Looks for patterns like "illustrated by", "art by", "artist:", etc.
 */
const extractArtist = (
  description?: string,
  authors?: string[]
): string | undefined => {
  if (!description) {
    return authors?.[1]; // Fallback to second author
  }

  // Common patterns for artist attribution
  const artistPatterns = [
    /illustrated by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /illustrator:?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /art(?:work)?\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /artist:?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /pencil(?:s|ed|ler)?\s+by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /drawn by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /and\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s+(?:who\s+)?illustrated/i,
    /artist?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /artists?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
  ];

  for (const pattern of artistPatterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Fallback to second author from authors array
  return authors?.[1];
};

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

    // Extract publisher
    const publisher = extractPublisher(
      volumeInfo.title,
      volumeInfo.description,
      volumeInfo.publisher
    );

    // Extract issue number from title if present
    let issueNumber = volumeInfo.publishedDate?.split("-")[0] || "TPB";
    const volMatch = volumeInfo.title.match(/Vol\.?\s*(\d+)/i);
    const issueMatch = volumeInfo.title.match(/#(\d+)/i);

    if (volMatch) {
      issueNumber = `Vol. ${volMatch[1]}`;
    } else if (issueMatch) {
      issueNumber = `#${issueMatch[1]}`;
    }

    // Extract writer and artist (Google Books just has "authors" array)
    const writer = extractWriter(volumeInfo.description, volumeInfo.authors);
    const artist = extractArtist(volumeInfo.description, volumeInfo.authors);

    const price = book.saleInfo.listPrice.amount;
    const currency = book.saleInfo.listPrice.currencyCode;
    const retailPrice = `${currency}${price.toFixed(2)}`;

    return {
      id: book.id,
      title: volumeInfo.title,
      issue: volumeInfo.publishedDate?.split("-")[0] || "N/A", // Use year as issue
      coverImage:
        volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") ||
        "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
      publisher,
      barcode,
      description: volumeInfo.description,
      creators: volumeInfo.authors,
      writer,
      artist,
      releaseDate: volumeInfo.publishedDate,
      retailPrice,
      source: "Google Books",
    };
  } catch (error) {
    console.error("Google Books API error:", error);
    return null;
  }
};

// Function to fetch comic data from Metron API using UPC
// const fetchFromMetron = async (barcode: string): Promise<Comic | null> => {
//   try {
//     // Try searching by UPC first
//     const searchResponse = await fetch(
//       `https://metron.cloud/api/issue/?upc=${barcode}`
//     );

//     if (!searchResponse.ok) return null;

//     const searchData = await searchResponse.json();

//     if (!searchData.results || searchData.results.length === 0) return null;

//     const issue: MetronIssue = searchData.results[0];

//     // Extract writer and artist from credits
//     const writer = issue.credits?.find(
//       (c) =>
//         c.role.toLowerCase().includes("writer") ||
//         c.role.toLowerCase().includes("script")
//     )?.creator;

//     const artist = issue.credits?.find(
//       (c) =>
//         c.role.toLowerCase().includes("artist") ||
//         c.role.toLowerCase().includes("pencil") ||
//         c.role.toLowerCase().includes("draw")
//     )?.creator;

//     return {
//       id: issue.id.toString(),
//       title: issue.series.name,
//       issue: `#${issue.number}`,
//       coverImage:
//         issue.image ||
//         "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
//       publisher: issue.publisher.name,
//       barcode,
//       description: issue.desc,
//       creators: issue.credits?.map((c) => `${c.creator} (${c.role})`),
//       writer,
//       artist,
//       releaseDate: issue.cover_date,
//       source: "Metron",
//     };
//   } catch (error) {
//     console.error("Metron API error:", error);
//     return null;
//   }
// };

/**
 * Main function: Try multiple APIs in sequence until we get data
 */
export const fetchComicByBarcode = async (
  barcode: string
): Promise<Comic | null> => {
  console.log(`🔍 Searching for comic with barcode: ${barcode}`);

  // Try Google Books first (fastest, most reliable for TPBs)
  console.log("Trying Google Books...");
  const comic = await fetchFromGoogleBooks(barcode);
  if (comic) {
    console.log("Found on Google Books");
    console.log("Comic data:", comic);
    return comic;
  }

  //   // Try Metron second (best for single issues)
  //   console.log("Trying Metron...");
  //   comic = await fetchFromMetron(barcode);
  //   if (comic) {
  //     console.log("Found on Metron");
  //     return comic;
  //   }

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
