"use client";

import React, { useState } from "react";
import { Box, Button, TextField, Typography, Container, Stack, Alert, AppBar, Toolbar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import withAuth from "../../api/withAuth";
import { useRouter } from 'next/navigation';
import { submitVehicleData } from '../../api/auth'; // Import the API function

interface FormData {
  carModel: string;
  price: string;
  phoneNumber: string;
  city: string;
  images: File[];
  userId: string;
}

const Dashboard = () => {
  const userId = localStorage.getItem('userId') || "";
  
  const [formData, setFormData] = useState<FormData>({
    carModel: "",
    price: "",
    phoneNumber: "",
    city: "",
    images: [],
    userId: userId
  });

  const [pictureThumbnails, setPictureThumbnails] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // New success message state
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      userId: userId
    });
  };

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, images: files as File[] });
    const thumbnails = files.map((file) => URL.createObjectURL(file));
    setPictureThumbnails(thumbnails);
    setErrorMessage(null);
    setSuccessMessage(null); // Reset success message on new upload
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      setErrorMessage("Please upload at least one image.");
      return;
    }

    try {
      await submitVehicleData(formData); // Call the API function
      setFormData({ carModel: "", price: "", phoneNumber: "", city: "", userId: "", images: [] });
      setPictureThumbnails([]);
      setErrorMessage(null);
      setSuccessMessage("Vehicle information submitted successfully!"); // Set success message
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        setErrorMessage(error.message);
      } else {
        console.error("An unexpected error occurred:", error);
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Vehicle Submission
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Submit Your Vehicle Information
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Stack spacing={3}>
            <TextField
              label="Car Model"
              name="carModel"
              fullWidth
              required
              value={formData.carModel}
              onChange={handleChange}
              inputProps={{ minLength: 3 }}
            />
            <TextField
              label="Price"
              name="price"
              fullWidth
              required
              value={formData.price}
              onChange={handleChange}
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              fullWidth
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              inputProps={{ maxLength: 11 }}
            />
            <TextField
              label="City"
              name="city"
              fullWidth
              required
              value={formData.city}
              onChange={handleChange}
            />
            <Button variant="contained" component="label" fullWidth>
              Upload images
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handlePictureUpload}
              />
            </Button>
            {pictureThumbnails.length > 0 && (
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                {pictureThumbnails.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`thumbnail-${index}`}
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                ))}
              </Stack>
            )}
            {errorMessage && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Alert>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit Vehicle
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default withAuth(Dashboard);
