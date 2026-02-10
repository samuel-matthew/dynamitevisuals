import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getContacts, ContactData } from "@/lib/api/contact";
import { Loader2, Mail, Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// Extended ContactData to include timestamp and ID if they exist in backend response
interface ExtendedContactData extends ContactData {
    _id: string;
    createdAt: string;
    status: string;
}

const InquiriesPage = () => {
    const [search, setSearch] = useState("");
    const [selectedInquiry, setSelectedInquiry] = useState<ExtendedContactData | null>(null);

    const { data: inquiries, isLoading } = useQuery({
        queryKey: ["inquiries"],
        queryFn: getContacts,
    });

    const filteredInquiries = inquiries?.filter((inquiry: ExtendedContactData) =>
        inquiry.name.toLowerCase().includes(search.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(search.toLowerCase()) ||
        inquiry.subject?.toLowerCase().includes(search.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold">Inquiries</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your messages and contact requests.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search inquiries..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-background/50 border-border/50"
                    />
                </div>
            </div>

            <div className="border border-border/50 rounded-lg overflow-hidden bg-card/50 backdrop-blur-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-muted/50 border-border/50">
                            <TableHead>Client</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInquiries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No inquiries found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInquiries.map((inquiry: ExtendedContactData) => (
                                <TableRow key={inquiry._id} className="hover:bg-muted/50 border-border/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Mail className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{inquiry.name}</p>
                                                <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${inquiry.type === "hire"
                                                ? "bg-purple-500/10 text-purple-500"
                                                : "bg-blue-500/10 text-blue-500"
                                            }`}>
                                            {inquiry.type === "hire" ? "Hire Request" : "General"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {inquiry.subject || "No Subject"}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {inquiry.createdAt ? format(new Date(inquiry.createdAt), "MMM d, yyyy") : "N/A"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSelectedInquiry(inquiry)}
                                            className="hover:bg-primary/10 hover:text-primary"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Inquiry Detail Dialog */}
            <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Inquiry Details</DialogTitle>
                        <DialogDescription>
                            Received on {selectedInquiry?.createdAt ? format(new Date(selectedInquiry.createdAt), "PPP p") : ""}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Name</p>
                                <p>{selectedInquiry?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                                <a href={`mailto:${selectedInquiry?.email}`} className="text-primary hover:underline">
                                    {selectedInquiry?.email}
                                </a>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Type</p>
                            <p className="capitalize">{selectedInquiry?.type}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Subject</p>
                            <p>{selectedInquiry?.subject || "N/A"}</p>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-md">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Message</p>
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                {selectedInquiry?.message}
                            </p>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button onClick={() => window.location.href = `mailto:${selectedInquiry?.email}`}>
                                Reply via Email
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default InquiriesPage;
