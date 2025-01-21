import React from "react";

const Heading = (props: any) => {
  return (
    <div className="text-green-700 text-2xl font-bold  md:font-extrabold md:text-5xl text-center my-10">
      {props.title}
    </div>
  );
};

export default Heading;
