// pages/index.tsx
import { useState, useEffect } from "react";
import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Sanity client setup
const client = sanityClient({
  projectId: "your-project-id", // replace with your project ID
  dataset: "production", // replace with your dataset name
  useCdn: true, // set to `false` if you want fresh data every time
});

// Image URL builder setup
const builder = imageUrlBuilder(client);
const urlFor = (source: any) => builder.image(source);

interface Slider {
  _id: string;
  title: string;
  Image: {
    asset: {
      _ref: string;
    };
  };
}

const SliderComponent = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);

  useEffect(() => {
    const fetchSliderData = async () => {
      const query = '*[_type == "Slider"]{_id, title, Image}';
      const data: Slider[] = await client.fetch(query);
      setSliders(data);
    };

    fetchSliderData();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <h1>Slider</h1>
      <div className="slider">
        {sliders.map((slider) => (
          <div key={slider._id}>
            <h2>{slider.title}</h2>
            <img src={urlFor(slider.Image).url()} alt={slider.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderComponent;
