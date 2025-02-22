import { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sendImage, setSendImage] = useState(null);
  const [matchedImages, setMatchedImages] = useState([]);

  const handleFileInputChange = (event) => {
    setSendImage(event.target.files[0]);
    setSelectedFile(URL.createObjectURL(event.target.files[0]));
    console.log(selectedFile);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("sketch", sendImage);

      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMatchedImages([]);
      console.log(response.data);
      setMatchedImages(response.data);
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };
  const pushNotification = async () => {
    console.log(matchedImages[0]);
    const response = await fetch("http://localhost:3500/notify", {
      method: "POST",
      body: new URLSearchParams({
        name: matchedImages[0].identity,
        pic: matchedImages[0].identity,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      const response = await fetch("http://localhost:3500/publish", {
        method: "GET",
      });
    } else {
      console.log(data);
    }
  };
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col  items-center">
        <input
          className="border-black border-2  rounded-md mb-4"
          type="file"
          onChange={handleFileInputChange}
        />
        <button
          className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>

      <div className="flex flex-col items-center justify-evenly mt-4">
        <div>
          <img src={selectedFile} style={{ width: "10vw" }} alt="" />
          <p className="text-center">Uploaded Sketch</p>
        </div>
        <div className="text-lg font-bold py-4">Matched Images</div>
        <div className="flex ">
          {matchedImages.length == 0 ? (
            <div>No Image Found</div>
          ) : (
            matchedImages.map((item) => {
              const name = item.identity.match(/([^\\]+)(?=\.\w+$)/)[0];
              var image_gender = matchedImages[0].identity.split("-")[0];
              image_gender = sendImage.name.split("-")[0][0];
              var gender = name.split("-")[0][0];
              console.log(gender[0]);

              console.log(image_gender[0]);
              if (gender == image_gender) {
                return (
                  <div key={item.identity} className="px-2">
                    <img
                      src={item.identity}
                      alt={`Matched image for ${item}`}
                      style={{ width: "10vw" }}
                    />
                    <p className="text-left">Matched Image</p>
                    <p className="text-left">
                      Person Name:{" "}
                      {item.identity.match(/([^\\]+)(?=\.\w+$)/)[0]}
                    </p>
                    <p className="text-left">
                      Matched Percentage:{" "}
                      {((1 - item.distance) * 100).toFixed(2)}%
                    </p>
                  </div>
                );
              }
            })
          )}
        </div>
      </div>
      <button
        className="border-2 border-black p-2 m-2 rounded-md hover:text-white hover:bg-black"
        onClick={pushNotification}
      >
        Push Notification
      </button>
      <div>*Note - Push Notification will send highest matching image </div>
    </div>
  );
}

export default App;
