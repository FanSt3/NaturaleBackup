"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export default function BlogCard({ id, title, content, createdAt }: BlogCardProps) {
  const formattedDate = new Intl.DateTimeFormat("sr-RS", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(createdAt);

  // Extract a short excerpt from the content
  const excerpt = content.length > 200 
    ? content.substring(0, 200) + "..." 
    : content;

  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 line-clamp-4">{excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <Link href={`/blog/${id}`}>
            Pročitaj više
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 