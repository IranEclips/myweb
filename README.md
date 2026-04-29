# OpenEdge Performance Toolkit

A specialized research project focused on benchmarking Edge Runtime capabilities and HTTP header propagation efficiency within distributed networks.

## Core Features
- **Edge-Level Processing**: Leveraging Vercel Edge functions for low-latency request handling.
- **Header Optimization**: Advanced logic for stripping and re-mapping inbound/outbound HTTP headers.
- **Routing Engine**: Intelligent path-based routing for microservices.

## Project Structure
- `/api`: Contains the core logic for the request lifecycle.
- `vercel.json`: Configuration for routing and environment-specific rewrites.

## Technical Goals
The primary goal is to measure the overhead of dynamic fetching at the edge and improve the reliability of upstream communication.