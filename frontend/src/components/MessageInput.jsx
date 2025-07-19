import {useState, useRef} from 'react'
import {useChatStore} from '../store/useChatStore.js';
import {X, Image, Send} from 'lucide-react';

const MessageInput = () => {
    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if(!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    };
    
    const removeImage = () => {
      setImagePreview(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
      e.preventDefault();
      if(!text.trim() && !imagePreview) return; //if no text or image, do nothing
      try{
        await sendMessage({
          text: text.trim(),
          image: imagePreview ? imagePreview : null
        });

        //Clear form
        setText('');
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = ""; //Reset file input
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };
  return (
    //Image preview
    <div className="p-4 w-full">
      {imagePreview && (
        <div className=".mb-3.flex.items-center.gap-2">
         <div className="relative">
           <img 
           src={imagePreview}
           alt="Preview" 
           className="w-16 h-16 object-cover rounded-lg border border-zinc-700" 
           />
           <button 
           onClick={removeImage} 
           className="absolute -top-1.5 -right-1.5
           w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
           type="button"
           >
            <X className="w-4 h-4" />
           </button>
           </div>
         </div>
      )}
      {/* Message input area */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-zinc-700 rounded-lg"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          type="button"
          className={`hidden sm:flex btn btn-circle ${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`}
           onClick={() => fileInputRef.current?.click()}
        >
          <Image className="size-6" />
        </button>
        <button
          type="submit"
          className="btn btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send className="size-5" />
        </button>
      </form>
    </div>
  )
}

export default MessageInput
