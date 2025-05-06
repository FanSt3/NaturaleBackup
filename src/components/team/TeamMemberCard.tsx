"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMemberProps {
  id: string;
  name: string;
  position: string;
  image?: string | null;
  description: string;
}

export default function TeamMemberCard({ id, name, position, image, description }: TeamMemberProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-48 w-full bg-emerald-100">
          {image ? (
            <div className="relative w-full h-full">
              <Image 
                src={image} 
                alt={name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-emerald-500 text-white text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{position}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 line-clamp-3">{description}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            Saznaj više
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>{position}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-emerald-100">
                {image ? (
                  <Image 
                    src={image} 
                    alt={name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="bg-emerald-500 text-white text-2xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            </div>
            <div className="md:w-2/3">
              <div className="prose prose-emerald max-w-none">
                <p className="whitespace-pre-line">{description}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 