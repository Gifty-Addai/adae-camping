import React, { useEffect, useState } from 'react';
import { useContactAPI, ContactMessage } from '@/hooks/contact.hook';
import { Spinner } from '@/components/ui/loader/_spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Page } from '@/components/ui/page';
import {
  Mail,
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  Phone,
  CornerUpLeft,
  MessageSquare
} from 'lucide-react';
import { toast } from 'react-toastify';

const ContactsDash: React.FC = () => {
  const {
    getContactMessages,
    updateContactMessageStatus,
    replyContactMessage,
    deleteContactMessage,
    loading
  } = useContactAPI();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  
  // Search & Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);

  // Reply state
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  const fetchMessages = async (currentPage: number, status: string, query: string) => {
    const res = await getContactMessages(currentPage, 10, status, query);
    if (res) {
      setMessages(res.data);
      setTotalPages(res.totalPages);
      setTotalData(res.totalData);
      
      // Keep selected message updated if it exists in the new list, or update it
      if (selectedMessage) {
        const updated = res.data.find(m => m._id === selectedMessage._id);
        if (updated) {
          setSelectedMessage(updated);
        }
      }
    }
  };

  useEffect(() => {
    fetchMessages(page, statusFilter, search);
  }, [page, statusFilter]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      fetchMessages(1, statusFilter, search);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setReplyText('');
    
    // If the message is unread, automatically mark it as read
    if (msg.status === 'unread') {
      const updated = await updateContactMessageStatus(msg._id, 'read');
      if (updated) {
        // Update local list
        setMessages(prev => prev.map(m => m._id === msg._id ? updated : m));
        setSelectedMessage(updated);
      }
    }
  };

  const handleToggleStatus = async (msg: ContactMessage) => {
    const targetStatus = msg.status === 'read' ? 'unread' : 'read';
    const updated = await updateContactMessageStatus(msg._id, targetStatus);
    if (updated) {
      setMessages(prev => prev.map(m => m._id === msg._id ? updated : m));
      if (selectedMessage && selectedMessage._id === msg._id) {
        setSelectedMessage(updated);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      const success = await deleteContactMessage(id);
      if (success) {
        setMessages(prev => prev.filter(m => m._id !== id));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
        setTotalData(prev => prev - 1);
      }
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage) return;
    if (!replyText.trim()) {
      toast.warning("Please type a reply message.");
      return;
    }

    setReplyLoading(true);
    const updated = await replyContactMessage(selectedMessage._id, replyText);
    setReplyLoading(false);

    if (updated) {
      setReplyText('');
      setMessages(prev => prev.map(m => m._id === selectedMessage._id ? updated : m));
      setSelectedMessage(updated);
    }
  };

  const getStatusBadge = (status: 'unread' | 'read' | 'replied') => {
    switch (status) {
      case 'unread':
        return <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30">Unread</Badge>;
      case 'read':
        return <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30">Read</Badge>;
      case 'replied':
        return <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30">Replied</Badge>;
      default:
        return null;
    }
  };

  return (
    <Page
      pageTitle="Contact Messages"
      renderBody={() => (
        <div className="bg-[#2a2a2a] min-h-[calc(100vh-4rem)] p-6 text-gray-100 flex flex-col">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                <Mail className="w-6 h-6 text-[#8b7355]" />
                Customer Inquiries
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                View and respond to messages submitted via the contact us form.
              </p>
            </div>
            <Badge variant="outline" className="text-md py-1 px-4 text-gray-300 border-gray-600">
              {totalData} Messages
            </Badge>
          </div>

          {/* Main Workspace Layout */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Column: Inbox List */}
            <div className="lg:col-span-5 flex flex-col bg-[#1d1d1d] border border-[#3d3d3d] rounded-2xl overflow-hidden min-h-[500px]">
              
              {/* Search & Tabs */}
              <div className="p-4 border-b border-[#3d3d3d] space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search name, email, or content..."
                    className="pl-9 bg-[#2a2a2a] border-[#3d3d3d] text-white placeholder:text-gray-500 focus:ring-[#8b7355] focus:border-[#8b7355]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                {/* Status Tabs */}
                <div className="flex gap-1 bg-[#252525] p-1 rounded-lg">
                  {(['all', 'unread', 'read', 'replied'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setStatusFilter(tab);
                        setPage(1);
                      }}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${
                        statusFilter === tab
                          ? 'bg-[#8b7355] text-white shadow-md'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto max-h-[550px] divide-y divide-[#252525]">
                {loading && messages.length === 0 ? (
                  <div className="flex justify-center items-center py-12">
                    <Spinner size="lg" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-serif">No messages found</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`p-4 cursor-pointer transition-all hover:bg-[#252525] relative ${
                        selectedMessage?._id === msg._id ? 'bg-[#2a2a2a] border-l-4 border-[#8b7355]' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-200 line-clamp-1">{msg.name}</span>
                        <span className="text-[10px] text-gray-500 whitespace-nowrap">
                          {format(new Date(msg.createdAt), 'MMM dd')}
                        </span>
                      </div>
                      
                      <div className="text-xs text-[#d4c5a9] mb-2 font-mono line-clamp-1">{msg.email}</div>
                      
                      <p className="text-xs text-gray-400 line-clamp-2 mb-3 pr-2">
                        {msg.message}
                      </p>

                      <div className="flex justify-between items-center">
                        {getStatusBadge(msg.status)}
                        {msg.status !== 'replied' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(msg);
                            }}
                            className="text-[10px] text-gray-400 hover:text-[#8b7355] underline transition-colors"
                          >
                            Mark as {msg.status === 'read' ? 'Unread' : 'Read'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination Footer */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-[#3d3d3d] flex justify-between items-center bg-[#181818]">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    className="border-[#3d3d3d] bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    className="border-[#3d3d3d] bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column: Message Detail Pane */}
            <div className="lg:col-span-7 flex flex-col bg-[#1d1d1d] border border-[#3d3d3d] rounded-2xl overflow-hidden">
              {selectedMessage ? (
                <div className="flex-1 flex flex-col h-full">
                  {/* Detail Header */}
                  <div className="p-6 border-b border-[#3d3d3d] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#181818]">
                    <div>
                      <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                        {selectedMessage.name}
                      </h2>
                      <div className="flex flex-col gap-1 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5 font-mono text-[#d4c5a9]">
                          <Mail className="w-3.5 h-3.5 text-gray-500" />
                          <a href={`mailto:${selectedMessage.email}`} className="hover:underline">
                            {selectedMessage.email}
                          </a>
                        </span>
                        {selectedMessage.phone && (
                          <span className="flex items-center gap-1.5 font-mono">
                            <Phone className="w-3.5 h-3.5 text-gray-500" />
                            <a href={`tel:${selectedMessage.phone}`} className="hover:underline">
                              {selectedMessage.phone}
                            </a>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 self-stretch sm:self-auto justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(selectedMessage.status)}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(selectedMessage._id)}
                          className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(selectedMessage.createdAt), 'MMM dd, yyyy h:mm a')}
                      </span>
                    </div>
                  </div>

                  {/* Detail Body */}
                  <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[350px]">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Inquiry message</span>
                      <div className="bg-[#2a2a2a] p-5 rounded-xl border border-[#3d3d3d] text-gray-300 text-sm whitespace-pre-wrap leading-relaxed shadow-inner">
                        {selectedMessage.message}
                      </div>
                    </div>

                    {/* Replied Section */}
                    {selectedMessage.status === 'replied' && (
                      <div className="space-y-2 border-t border-[#3d3d3d] pt-4">
                        <span className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Reply Sent
                        </span>
                        <div className="bg-[#242f20]/40 p-5 rounded-xl border border-[#3c5035]/30 text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                          {selectedMessage.replyMessage}
                        </div>
                        {selectedMessage.repliedAt && (
                          <p className="text-[10px] text-gray-500 text-right mt-1 font-mono">
                            Replied on {format(new Date(selectedMessage.repliedAt), 'MMM dd, yyyy h:mm a')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Reply Action Box */}
                  {selectedMessage.status !== 'replied' && (
                    <div className="p-6 border-t border-[#3d3d3d] bg-[#1a1a1a] space-y-4">
                      <div className="flex items-center gap-2">
                        <CornerUpLeft className="w-4 h-4 text-[#8b7355]" />
                        <span className="text-sm font-semibold text-gray-300">Reply via email</span>
                      </div>
                      
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Type your reply to the customer here... Once sent, an email response will be delivered via Mailjet."
                          rows={4}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="bg-[#2a2a2a] border-[#3d3d3d] text-white placeholder:text-gray-500 focus:ring-[#8b7355] focus:border-[#8b7355] resize-none"
                        />
                        
                        <div className="flex justify-end">
                          <Button
                            onClick={handleSendReply}
                            disabled={replyLoading}
                            className="bg-[#8b7355] hover:bg-[#6d5a44] text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 shadow-lg shadow-amber-950/20"
                          >
                            {replyLoading ? (
                              <Spinner size="sm" />
                            ) : (
                              <>
                                Send Reply
                                <MessageSquare className="w-4 h-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center p-12 text-center text-gray-500">
                  <Mail className="w-16 h-16 text-[#3d3d3d] mb-4 stroke-1 animate-pulse" />
                  <h3 className="text-lg font-serif font-semibold text-gray-400 mb-1">No Message Selected</h3>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Choose a conversation from the sidebar list to view contact details, message contents, and compose an email reply.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    />
  );
};

export default ContactsDash;
