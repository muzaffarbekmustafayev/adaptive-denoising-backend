# Adaptive Denoising Backend

This is a Node.js backend for adaptive audio denoising using FFmpeg and BullMQ.

## Features

- **Authentication**: JWT-based auth with User and Admin roles.
- **API Key Management**: Secure API key generation and validation for external clients.
- **Audio Processing**: Pluggable architecture for noise reduction (FFmpeg-based MVP).
- **Asynchronous Processing**: Scalable job queue using BullMQ and Redis.
- **Usage Tracking**: Detailed statistics on API requests and audio duration.

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- Redis
- FFmpeg (installed on the system)

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user profile
- `POST /api/api-keys` - Generate new API key
- `POST /api/audio/denoise` - Upload audio for denoising (requires API key)
- `GET /api/audio/jobs/:id` - Check job status
- `GET /api/audio/jobs/:id/download` - Download processed audio

## Architecture

The project follows a modular structure where each feature (auth, user, apiKey, audio, usage) is contained in its own module directory. The audio processing logic is decoupled from the API layer using a pluggable engine architecture.
