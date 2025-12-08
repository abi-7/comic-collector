// Types for comic book data
export interface Comic {
  id: string;
  title: string;
  issue: string;
  coverImage: string;
  publisher: string;
  barcode?: string;
  description?: string;
  creators?: string[];
  writer?: string;
  artist?: string;
  releaseDate?: string;
  retailPrice?: string;
  source?: "Google Books" | "Metron" | "Comic Vine" | "Manual";
}

export interface GoogleBooksResponse {
  items?: Array<{
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      publisher?: string;
      publishedDate?: string;
      description?: string;
      industryIdentifiers?: Array<{
        type: string;
        identifier: string;
      }>;
      imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
      };
    };
    saleInfo?: {
      country: string;
      saleability: string;
      isEbook: boolean;
      listPrice?: {
        amount: number;
        currencyCode: string;
      };
      retailPrice?: {
        amount: number;
        currencyCode: string;
      };
    };
  }>;
}

export interface MetronIssue {
  id: number;
  series: {
    name: string;
  };
  number: string;
  cover_date: string;
  image?: string;
  publisher: {
    name: string;
  };
  upc?: string;
  desc?: string;
  credits?: Array<{
    creator: string;
    role: string;
  }>;
}
