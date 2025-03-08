# Intersection Dashboard

A web application for visualizing Texas intersections data.

## Overview

This project displays intersection data with charts, maps, and stats.  
It uses Next.js and dynamic imports for efficient rendering.

## Setup

1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## File Structure

- `src/app/layout.tsx` - Root layout of the application.
- `src/app/page.tsx` - Main dashboard page.
- Other files and components reside in their respective folders.

## Usage

Prepare data, convert xlsx data to JSON and infer types.

```bash
    pip install -r ./py-scripts/requirements.txt

    python ./py-scripts/convert_xlsx_to_json_w_types.py ./src/data/intersection_data.xlsx
```
