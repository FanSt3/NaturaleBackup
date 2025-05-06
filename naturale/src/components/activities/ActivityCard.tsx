"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ActivityProps {
  id: string;
  title: string;
  content: string;
  image?: string;
  date: Date;
}

export default function ActivityCard({ id, title, content, image, date }: ActivityProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formattedDate = new Intl.DateTimeFormat("sr-RS", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  // Function to validate if an image path is valid for Next.js Image component
  const isValidImagePath = (path?: string) => {
    if (!path) return false;
    
    // Accept absolute URLs
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return true;
    }
    
    // Accept paths from our uploads folder (which start with /)
    if (path.startsWith('/uploads/')) {
      return true;
    }
    
    return false;
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="relative h-48 w-full bg-emerald-100">
          {image && isValidImagePath(image) ? (
            <Image 
              src={image} 
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-emerald-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5" />
              </svg>
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <CardDescription>{formattedDate}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-600 line-clamp-3">{content}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            Pročitaj više
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{formattedDate}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {image && isValidImagePath(image) && (
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                <Image 
                  src={image} 
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="prose prose-emerald max-w-none">
              <p className="whitespace-pre-line">{content}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 