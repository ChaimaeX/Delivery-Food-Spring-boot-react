const upload_preset = "chaimae-food";
const api_url = "https://api.cloudinary.com/v1_1/dudie5qxe/image/upload";

export const uploadImageToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", upload_preset);

  const res = await fetch(api_url, {
    method: "POST",
    body: data
  });

  const fileData = await res.json();
  return fileData.url;
};
