"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import React from "react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending}>
      {pending ? "Updating..." : "Update"}
    </Button>
  );
}

const handleProfileUpdate = async (prevState: any, formData: FormData) => {
  const data = Object.fromEntries(formData);
  console.log("Profile update data:", JSON.stringify(data, null, 2));
  // Simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { message: "Profile updated successfully!" };
};

const handleShopUpdate = async (prevState: any, formData: FormData) => {
  const data = Object.fromEntries(formData);
  console.log("Shop update data:", JSON.stringify(data, null, 2));
  // Simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { message: "Shop updated successfully!" };
};

function SettingsPage() {
  // useActionState replaces useFormState
  const [profileState, profileFormAction] = React.useActionState(
    handleProfileUpdate,
    { message: "" }
  );
  const [shopState, shopFormAction] = React.useActionState(
    handleShopUpdate,
    { message: "" }
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Edit Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={profileFormAction}>
              <div className="grid gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Enter your name" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    type="tel"
                  />
                </div>
                <SubmitButton />
                {profileState?.message && <p>{profileState.message}</p>}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Edit Shop */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Shop</CardTitle>
            <CardDescription>Update your shop information</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={shopFormAction}>
              <div className="grid gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input
                    id="shopName"
                    name="shopName"
                    placeholder="Enter shop name"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="shopEmail">Shop Email</Label>
                  <Input
                    id="shopEmail"
                    name="shopEmail"
                    placeholder="Enter shop email"
                    type="email"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="shopPhone">Shop Phone</Label>
                  <Input
                    id="shopPhone"
                    name="shopPhone"
                    placeholder="Enter shop phone number"
                    type="tel"
                  />
                </div>
                <SubmitButton />
                {shopState?.message && <p>{shopState.message}</p>}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SettingsPage;
