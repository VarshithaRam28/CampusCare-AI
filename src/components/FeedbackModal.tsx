import React, { useState } from 'react';
import type { Complaint } from '../types';
import { Star, X } from 'lucide-react';

interface FeedbackModalProps {
  complaint: Complaint;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ complaint, onClose, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit(rating, feedback);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-white/5">
          <h2 className="text-xl font-semibold text-white">Resolution Feedback</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6 text-center">
            <p className="text-gray-300 mb-1 text-sm">Issue ID: {complaint.id}</p>
            <p className="font-medium text-white line-clamp-1">{complaint.title}</p>
          </div>

          <div className="mb-8">
            <label className="block text-center text-sm font-medium text-gray-300 mb-3">
              Was your issue resolved satisfactorily?
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={36}
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'text-gray-600'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-400 mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              id="feedback"
              rows={3}
              className="input-field w-full rounded-lg text-sm resize-none"
              placeholder="Tell us what went well or what could be improved..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-4 py-2 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0}
              className="btn-primary px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
