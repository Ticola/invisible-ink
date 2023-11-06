const InputForm = ({ url, onUrlChange, onSubmit }) => {
  return (
    <form className="flex justify-center mb-10" onSubmit={onSubmit}>
      <input
        type="text"
        className="form-input px-4 py-2 w-1/2 rounded-l-md border-2 border-r-0 border-slate-400"
        placeholder="Enter a URL to scrape"
        value={url}
        onChange={onUrlChange}
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-r-md"
      >
        Scrape
      </button>
    </form>
  );
};


export default InputForm;
