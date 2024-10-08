// src/api/auth.ts
export const authenticateUser = async (email: string, password: string) => {
    console.log("Authenticating user:", email, password);
    
    const response = await fetch('https://assessment-8dps.onrender.com/users/login', { // Your actual API endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    // Handle various HTTP errors
    if (response.status === 401) {
      throw new Error('Unauthorized: Incorrect email or password.'); // Custom message for 401 errors
    } else if (!response.ok) {
      throw new Error('User not authenticated.'); // Handle other errors
    }
  
    return response.json(); // Assuming your API returns JSON data
  };
  



  export const validateToken = async (token: string) => {
    console.log("Authenticating user:", token);
    
    const response = await fetch(`https://assessment-8dps.onrender.com/users/verifyToken/${token}`, { // Your actual API endpoint
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  
    // Handle various HTTP errors
    if (response.status === 401) {
      throw new Error('Unauthorized: Token Expired or Wrong.'); // Custom message for 401 errors
    } else if (!response.ok) {
      throw new Error('Token not authenticated.'); // Handle other errors
    }
    const responseData = await response.text(); // Get response as text
    const data = JSON.parse(responseData)
    return data.data.decoded.userId
  };
  





// api/vehicleApi.ts
// api/vehicleApi.ts
export const submitVehicleData = async (vehicleData: { carModel: string; price: string; phoneNumber: string; city: string; userId: string; images: File[] }) => {
  const formData = new FormData();

  // Append the fields to the FormData object
  formData.append("carModel", vehicleData.carModel);
  formData.append("price", vehicleData.price);
  formData.append("phone", vehicleData.phoneNumber);
  formData.append("city", vehicleData.city);
  formData.append("userId", vehicleData.userId);

  // Append each picture file
  vehicleData.images.forEach((file) => {
    formData.append("images", file); // Append each picture file
  });

  console.log("Form data before submission:", Array.from(formData.entries())); // To check the FormData content

  // Get the token from localStorage
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {}; // Initialize headers as an empty object

  // Conditionally add the Authorization header if the token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('https://assessment-8dps.onrender.com/vehicles', {
    method: 'POST',
    body: formData,
    headers, // Use the headers object
  });

  // Handle various HTTP errors
  if (response.status === 400) {
    throw new Error('Bad Request: Invalid data provided.'); 
  } else if (!response.ok) {
    throw new Error('Failed to submit vehicle data.'); 
  }

  return response.json(); 
};

