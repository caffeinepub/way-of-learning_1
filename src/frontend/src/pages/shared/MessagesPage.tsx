import { useState } from 'react';
import { useGetMessages, useSendMessage, useGetCallerUserProfile } from '../../hooks/useQueries';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import EmptyState from '../../components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

export default function MessagesPage() {
  const { data: messages, isLoading } = useGetMessages();
  const { data: userProfile } = useGetCallerUserProfile();
  const { mutate: sendMessage, isPending } = useSendMessage();
  const [receiverId, setReceiverId] = useState('');
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = () => {
    if (!receiverId.trim() || !messageText.trim()) {
      toast.error('Please enter both receiver ID and message');
      return;
    }

    sendMessage(
      { receiverId: receiverId.trim(), message: messageText.trim() },
      {
        onSuccess: () => {
          toast.success('Message sent successfully');
          setMessageText('');
          setReceiverId('');
        },
        onError: (error) => {
          toast.error(`Failed to send message: ${error.message}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" text="Loading messages..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Receiver ID</label>
            <Input
              placeholder="Enter receiver's user ID"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Message</label>
            <Textarea
              placeholder="Type your message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              disabled={isPending}
              rows={4}
            />
          </div>
          <Button onClick={handleSendMessage} disabled={isPending}>
            <Send className="mr-2 h-4 w-4" />
            {isPending ? 'Sending...' : 'Send Message'}
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Received Messages</h2>
        {messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">From: {msg.senderId}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(Number(msg.timestamp) / 1000000).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No messages yet"
            description="You haven't received any messages"
          />
        )}
      </div>
    </div>
  );
}
