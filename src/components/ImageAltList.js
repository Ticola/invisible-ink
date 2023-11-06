const ImageAltList = ({ altTexts = [] }) => {
  // Log the altTexts to see what you're getting
  console.log(altTexts);

  return (
    <ol className="list-decimal list-inside">
      {altTexts.map((alt, index) => (
        <li key={index} className="py-1">
          {alt || "[No Alt Text]"}
        </li>
      ))}
    </ol>
  );
};

export default ImageAltList;
