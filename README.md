# AI Tweet Generator

This is a web application that uses AI to generate viral tweets on any topic. You can customize the tone, length, and even add emojis and hashtags to create the perfect tweet.

## Features

- **Topic-based Generation:** Generate tweets on any subject you can think of.
- **Mood & Tone Control:** Specify the mood and tone to match your desired style (e.g., casual, professional, humorous).
- **Customization:** Add hashtags and emojis to make your tweets stand out.
- **Variable Length:** Choose between short, medium, or long tweets.
- **Multiple Generations:** Generate multiple tweet variations at once.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **UI:** [React](https://reactjs.org/) & [Tailwind CSS](https://tailwindcss.com/)
- **AI Model:** [OpenRouter](https://openrouter.ai/) with Google's `DeepSeek(R1)`

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd ai-tweet-generator
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the `ai-tweet-generator` directory and add your OpenRouter API key:
    ```
    OPENROUTER_API_KEY=your_openrouter_api_key
    ```
    You can get an API key from the [OpenRouter website](https://openrouter.ai/).

## Usage

To start the development server, run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API

The application has an API endpoint for generating tweets:

- `POST /api/tweet-generator`

You can send a POST request with a JSON body to this endpoint to generate tweets programmatically.

**Example Request Body:**

```json
{
  "topic": "AI",
  "mood": "excited",
  "hashtags": ["#AI", "#FutureTech"],
  "count": 2,
  "tone": "professional",
  "language": "en",
  "length": "medium",
  "emojis": ["🚀", "💡"]
}
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
