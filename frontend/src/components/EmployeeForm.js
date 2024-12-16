import React, { useState } from "react";
import axios from "axios"; // Import axios

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    employeeId: "",
    email: "",
    phoneNumber: "",
    department: "",
    dateOfJoining: "",
    role: "",
  });

  const [formErrors, setFormErrors] = useState({});
  
  // Function to check for duplicate employee ID, email, or phone number
  const checkDuplicates = async (name, value) => {
    try {
      const response = await axios.post("http://localhost:5000/api/checkDuplicates", {
        name,
        value,
      });
      if (response.data.exists) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} already exists.`,
        }));
      } else {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    } catch (error) {
      console.error("Error checking for duplicates:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({ ...formData, [name]: value });

    // Check for duplicate values immediately after typing
    if (name === "employeeId" || name === "email" || name === "phoneNumber") {
      checkDuplicates(name, value);
    }

    // If the field is dateOfJoining, check if the date is in the future
    if (name === "dateOfJoining") {
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
      if (value > today) {
        setFormErrors({
          ...formErrors,
          dateOfJoining: "Future dates cannot be accepted", // Set the error message
        });
      } else {
        setFormErrors({
          ...formErrors,
          dateOfJoining: "", // Clear the error if the date is valid
        });
      }
    }
  };

  const validateForm = () => {
    let errors = {};
    // Example validation rules
    if (!formData.firstName) errors.firstName = "First Name is required";
    if (!formData.lastName) errors.lastName = "Last Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Valid Email is required";
    if (!formData.phoneNumber || formData.phoneNumber.length !== 10)
      errors.phoneNumber = "Phone Number must be 10 digits";
    if (!formData.employeeId) errors.employeeId = "Employee ID is required";
    if (!formData.department) errors.department = "Department is required";
    if (!formData.dateOfJoining)
      errors.dateOfJoining = "Date of Joining is required";
    if (new Date(formData.dateOfJoining) > new Date())
      errors.dateOfJoining = "Date of Joining cannot be a future date";
    if (!formData.role) errors.role = "Role is required";

    setFormErrors(errors);

    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate the form before submitting
  if (validateForm()) {
    // Proceed with form submission (e.g., API call)
    axios
      .post("https://employee-management-login-form.onrender.com", formData) // Adjust the URL to your backend endpoint
      .then((response) => {
        console.log("Employee added:", response.data); // Log success
        alert("Form Submitted Successfully!");

        // Reset form fields and errors after successful submission
        setFormData({
          firstName: "",
          lastName: "",
          employeeId: "",
          email: "",
          phoneNumber: "",
          department: "",
          dateOfJoining: "",
          role: "",
        });
        setFormErrors({}); // Reset errors as well
      })
      .catch((error) => {
        console.error("Error adding employee:", error); // Log error
        alert("There was an error submitting the form.");
      });
  }
};
  

  return (
    <div className="max-w-lg mx-auto p-6 bg-sky-100 shadow-md rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name */}
        <div>
          <label className="block text-primary font-semibold">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="border p-3 rounded-xl w-full"
          />
          {formErrors.firstName && (
            <p className="text-red-500 text-sm">{formErrors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-primary font-semibold">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="border p-3 rounded-xl w-full"
          />
          {formErrors.lastName && (
            <p className="text-red-500 text-sm">{formErrors.lastName}</p>
          )}
        </div>

        {/* Employee ID */}
        <div>
          <label className="block text-primary font-semibold">Employee ID</label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            className="border p-3 rounded-xl w-full"
          />
          {formErrors.employeeId && (
            <p className="text-red-500 text-sm">{formErrors.employeeId}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-primary font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-3 rounded-xl w-full"
          />
          {formErrors.email && (
            <p className="text-red-500 text-sm">{formErrors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-primary font-semibold">Phone Number</label>
          <div className="flex space-x-2">
            <select
              name="countryCode"
              className="border p-3 rounded-xl w-1/2"
            >
              <option value="+91">+91 (India)</option>
              <option value="+1">+1 (USA, Canada)</option>
              <option value="+44">+44 (United Kingdom)</option>
              <option value="+61">+61 (Australia)</option>
              <option value="+81">+81 (Japan)</option>
              <option value="+33">+33 (France)</option>
              <option value="+49">+49 (Germany)</option>
              <option value="+39">+39 (Italy)</option>
              <option value="+34">+34 (Spain)</option>
              <option value="+55">+55 (Brazil)</option>
              <option value="+27">+27 (South Africa)</option>
              <option value="+7">+7 (Russia, Kazakhstan)</option>
              <option value="+20">+20 (Egypt)</option>
              <option value="+52">+52 (Mexico)</option>
              <option value="+86">+86 (China)</option>
            </select>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="border p-3 rounded-xl w-2/3"
            />
          </div>
          {formErrors.phoneNumber && (
            <p className="text-red-500 text-sm">{formErrors.phoneNumber}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="block text-primary font-semibold">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="border p-3 rounded-xl w-full"
          >
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
          </select>
          {formErrors.department && (
            <p className="text-red-500 text-sm">{formErrors.department}</p>
          )}
        </div>

        {/* Date of Joining */}
        <div>
          <label className="block text-primary font-semibold">Date of Joining</label>
          <input
            type="date"
            name="dateOfJoining"
            value={formData.dateOfJoining}
            onChange={handleChange}
            className="border p-3 rounded-xl w-full"
          />
          {formErrors.dateOfJoining && (
            <p className="text-red-500 text-sm">{formErrors.dateOfJoining}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-primary font-semibold">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border p-3 rounded-xl w-full"
          />
          {formErrors.role && (
            <p className="text-red-500 text-sm">{formErrors.role}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-primary text-white p-3 rounded-xl w-full transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
