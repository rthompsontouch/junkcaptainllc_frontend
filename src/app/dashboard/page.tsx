"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";
import { useAuth } from "@/context/AuthContext";
import type { Notification } from "@/context/DashboardContext";

interface PotentialCustomer {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  date: string;
  images: number;
  imageUrls?: string[];
  notes: string;
}

interface ServiceRecord {
  date: string;
  note: string;
}

interface ActiveCustomer {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  lastServiceDate: string;
  serviceNote: string;
  serviceHistory?: ServiceRecord[];
  images: number;
  notes: string;
}

type Customer = PotentialCustomer | ActiveCustomer;

function isPotentialCustomer(customer: Customer): customer is PotentialCustomer {
  return "date" in customer;
}

function isActiveCustomer(customer: Customer): customer is ActiveCustomer {
  return "lastServiceDate" in customer;
}

export default function DashboardPage() {
  const {
    potentialCustomers,
    activeCustomers,
    notifications,
    unreadNotifications,
    updateCustomer,
    deleteCustomer,
    convertToCustomer,
    checkDuplicateCustomers,
    mergeWithCustomer,
    addServiceRecord,
    markNotificationRead,
  } = useDashboard();
  const { user, logout, token } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"potential" | "customers">("potential");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Customer>>({});
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [newServiceDate, setNewServiceDate] = useState("");
  const [newServiceNote, setNewServiceNote] = useState("");
  const [addingService, setAddingService] = useState(false);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [convertCandidate, setConvertCandidate] = useState<PotentialCustomer | null>(null);
  const [duplicateCustomers, setDuplicateCustomers] = useState<ActiveCustomer[]>([]);
  const [convertLoading, setConvertLoading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!token) {
      router.replace("/login");
      return;
    }
  }, [mounted, token, router]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!lightboxImage) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxImage]);

  // Avoid hydration mismatch: server and initial client render the same loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!token) return null;

  const currentList = activeTab === "potential" ? potentialCustomers : activeCustomers;
  const filteredList = currentList.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    potential: potentialCustomers.length,
    customers: activeCustomers.length,
    total: potentialCustomers.length + activeCustomers.length,
  };

  const openConvertModal = async (customer: PotentialCustomer) => {
    setConvertCandidate(customer);
    setConvertModalOpen(true);
    setDuplicateCustomers([]);
    try {
      const matches = await checkDuplicateCustomers(customer.id);
      setDuplicateCustomers(matches);
    } catch {
      setDuplicateCustomers([]);
    }
  };

  const handleMergeWithCustomer = async (activeCustomer: ActiveCustomer) => {
    if (!convertCandidate) return;
    setConvertLoading(true);
    try {
      await mergeWithCustomer(convertCandidate.id, activeCustomer.id);
      setConvertModalOpen(false);
      setConvertCandidate(null);
      setDuplicateCustomers([]);
      setActiveTab("customers");
      setIsModalOpen(false);
      setSelectedCustomer(null);
    } catch {
      // Error logged
    } finally {
      setConvertLoading(false);
    }
  };

  const handleConvertToNewCustomer = async () => {
    if (!convertCandidate) return;
    setConvertLoading(true);
    try {
      await convertToCustomer(convertCandidate.id);
      setConvertModalOpen(false);
      setConvertCandidate(null);
      setDuplicateCustomers([]);
      setActiveTab("customers");
      setIsModalOpen(false);
      setSelectedCustomer(null);
    } catch {
      // Error logged
    } finally {
      setConvertLoading(false);
    }
  };

  const handleAddService = async () => {
    if (!selectedCustomer || !isActiveCustomer(selectedCustomer) || !newServiceDate.trim()) return;
    setAddingService(true);
    try {
      const updated = await addServiceRecord(selectedCustomer.id, newServiceDate.trim(), newServiceNote.trim());
      if (updated) {
        setSelectedCustomer(updated);
        setEditForm(updated);
        setNewServiceDate("");
        setNewServiceNote("");
      }
    } catch {
      // Error already logged
    } finally {
      setAddingService(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    if (!confirm(`Are you sure you want to delete ${selectedCustomer.name}?`)) return;
    await deleteCustomer(selectedCustomer.id, isPotentialCustomer(selectedCustomer) ? "potential" : "active");
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleUpdateCustomer = async () => {
    if (!selectedCustomer) return;
    await updateCustomer(selectedCustomer.id, editForm, isPotentialCustomer(selectedCustomer) ? "potential" : "active");
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const openCustomerModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditForm({ ...customer });
    setIsModalOpen(true);
    const notification = unreadNotifications.find((n) => n.customerId === customer.id);
    if (notification) markNotificationRead(notification.id);
  };

  const handleNotificationClick = (notification: Notification) => {
    setNotificationsOpen(false);
    setActiveTab("potential");
    const customer = potentialCustomers.find((c) => c.id === notification.customerId);
    if (customer) openCustomerModal(customer);
    markNotificationRead(notification.id);
  };

  const handleExport = () => {
    if (filteredList.length === 0) {
      alert("No customers to export");
      return;
    }
    const isPotential = activeTab === "potential";
    const headers = isPotential
      ? ["ID", "Name", "Email", "Phone", "Address", "Service", "Date", "Images", "Notes"]
      : ["ID", "Name", "Email", "Phone", "Address", "Service", "Last Service Date", "Service Note", "Images", "Notes"];
    const csvRows = [
      headers.join(","),
      ...filteredList.map((customer) => {
        if (isPotential && isPotentialCustomer(customer)) {
          return [customer.id, `"${customer.name}"`, customer.email, `"${customer.phone}"`, `"${customer.address}"`, `"${customer.service}"`, customer.date, customer.images, `"${(customer.notes || "").replace(/"/g, '""')}"`].join(",");
        }
        if (!isPotential && isActiveCustomer(customer)) {
          return [customer.id, `"${customer.name}"`, customer.email, `"${customer.phone}"`, `"${customer.address}"`, `"${customer.service}"`, customer.lastServiceDate, `"${(customer.serviceNote || "").replace(/"/g, '""')}"`, customer.images, `"${(customer.notes || "").replace(/"/g, '""')}"`].join(",");
        }
        return "";
      }),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `junk-captain-${isPotential ? "potential" : "active"}-customers-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`${sidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full md:translate-x-0"} bg-navy text-white transition-all duration-300 flex flex-col fixed h-full z-50 md:z-30`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image src="/brand/logo/logo_circle.png" alt="Junk Captain" fill className="object-contain" />
              </div>
              <div className="text-sm font-bold">Junk Captain CRM</div>
            </div>
          ) : (
            <div className="relative w-10 h-10 mx-auto">
              <Image src="/brand/logo/logo_circle.png" alt="Junk Captain" fill className="object-contain" />
            </div>
          )}
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-orange hover:bg-orange/90 transition-colors cursor-pointer">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {sidebarOpen && <span>Customers</span>}
              </button>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors mt-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      <div className={`flex-1 ml-0 md:ml-20 ${sidebarOpen ? "md:ml-64" : "md:ml-20"} transition-all duration-300`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-navy">Customer Management</h1>
                <p className="text-xs md:text-sm text-gray-500 hidden sm:block">Manage potential and active customers</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative">
                <button onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileMenuOpen(false); }} className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-semibold">{unreadNotifications.length}</span>
                  )}
                </button>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-30 md:hidden" onClick={() => setNotificationsOpen(false)} />
                    <div className="fixed md:absolute left-0 md:left-auto right-0 md:right-0 top-16 md:top-full mt-0 md:mt-2 bg-white md:rounded-lg shadow-lg border border-gray-200 w-full md:w-96 max-h-[calc(100vh-4rem)] md:max-h-[500px] overflow-y-auto z-40">
                      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadNotifications.length > 0 && (
                          <button onClick={() => notifications.filter((n) => !n.read).forEach((n) => markNotificationRead(n.id))} className="text-xs text-orange hover:text-orange/80 font-medium cursor-pointer">Mark all read</button>
                        )}
                      </div>
                      <div className="divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <p className="text-gray-500 text-sm">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notification) => {
                            const customer = potentialCustomers.find((c) => c.id === notification.customerId);
                            if (!customer) return null;
                            return (
                              <div key={String(notification.id)} onClick={() => handleNotificationClick(notification)} className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? "bg-orange/5" : ""}`}>
                                <p className="font-semibold text-gray-900 text-sm">New Quote Request</p>
                                <p className="text-sm text-gray-600"><span className="font-medium">{customer.name}</span> submitted a quote request</p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="relative">
                <button onClick={() => { setProfileMenuOpen(!profileMenuOpen); setNotificationsOpen(false); }} className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-orange rounded-full flex items-center justify-center text-white font-bold">{user?.name?.[0] ?? "A"}</div>
                  <div className="text-sm hidden md:block">
                    <div className="font-semibold text-gray-800">{user?.name ?? "Admin"}</div>
                    <div className="text-gray-500 truncate max-w-[120px]">{user?.email ?? "admin@junk..."}</div>
                  </div>
                </button>
                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40 md:hidden" onClick={() => setProfileMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <button
                        type="button"
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-red-600 font-semibold text-left cursor-pointer"
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                          router.push("/login");
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
            <div className="grid grid-cols-3 gap-2 md:gap-6 mb-8">
            <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <span className="text-xs md:text-sm font-medium text-gray-700">Total</span>
              <div className="text-xl md:text-3xl font-bold text-navy">{stats.total}</div>
            </div>
            <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <span className="text-xs md:text-sm font-medium text-gray-700">Potential</span>
              <div className="text-xl md:text-3xl font-bold text-navy">{stats.potential}</div>
            </div>
            <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-200">
              <span className="text-xs md:text-sm font-medium text-gray-700">Active</span>
              <div className="text-xl md:text-3xl font-bold text-navy">{stats.customers}</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex gap-3 md:gap-6">
                <button type="button" onClick={() => setActiveTab("potential")} className={`py-3 md:py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${activeTab === "potential" ? "border-orange text-orange" : "border-transparent text-gray-600 hover:text-gray-900"}`}>Potential Customers ({stats.potential})</button>
                <button type="button" onClick={() => setActiveTab("customers")} className={`py-3 md:py-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${activeTab === "customers" ? "border-orange text-orange" : "border-transparent text-gray-600 hover:text-gray-900"}`}>Active Customers ({stats.customers})</button>
              </nav>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex gap-4">
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange text-gray-900 placeholder:text-gray-500" />
              <button type="button" onClick={handleExport} className="px-4 md:px-6 py-2 bg-teal hover:bg-teal/90 text-white font-medium rounded-lg cursor-pointer transition-colors">Export</button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase">Service</th>
                    {activeTab === "customers" && <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase">Last Service</th>}
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase">Images</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-800 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredList.map((customer) => (
                    <tr key={String(customer.id)} onClick={() => openCustomerModal(customer)} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-600">{customer.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        <div className="text-gray-600">{customer.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{customer.service}</td>
                      {activeTab === "customers" && isActiveCustomer(customer) && <td className="px-6 py-4 text-gray-900">{customer.lastServiceDate}</td>}
                      <td className="px-6 py-4 text-gray-900">{customer.images}</td>
                      <td className="px-6 py-4 text-gray-900">{new Date(isPotentialCustomer(customer) ? customer.date : customer.lastServiceDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        {activeTab === "potential" && isPotentialCustomer(customer) && (
                          <button type="button" onClick={(e) => { e.stopPropagation(); openConvertModal(customer); }} className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors">Convert</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-gray-200">
              {filteredList.map((customer) => (
                <div key={String(customer.id)} onClick={() => openCustomerModal(customer)} className="p-4">
                  <div className="font-semibold text-gray-900">{customer.name}</div>
                  <div className="text-sm text-gray-600">{customer.service}</div>
                  {activeTab === "potential" && isPotentialCustomer(customer) && (
                    <button type="button" onClick={(e) => { e.stopPropagation(); openConvertModal(customer); }} className="mt-2 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors">Convert</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between">
              <h3 className="text-xl font-bold text-gray-900">Customer Details</h3>
              <button type="button" onClick={() => { setIsModalOpen(false); setSelectedCustomer(null); setNewServiceDate(""); setNewServiceNote(""); setLightboxImage(null); }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 cursor-pointer transition-colors" aria-label="Close">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Email</label>
                <input type="email" value={editForm.email || ""} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-orange focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Phone</label>
                <input type="tel" value={editForm.phone || ""} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-orange focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Address</label>
                <input type="text" value={editForm.address || ""} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-orange focus:border-transparent" />
              </div>

              {/* Service history + Last Service (active customers only) */}
              {activeTab === "customers" && isActiveCustomer(selectedCustomer) && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Last Service Date</label>
                    <input type="date" value={(editForm as ActiveCustomer).lastServiceDate || ""} onChange={(e) => setEditForm({ ...editForm, lastServiceDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Last Service Note</label>
                    <textarea value={(editForm as ActiveCustomer).serviceNote || ""} onChange={(e) => setEditForm({ ...editForm, serviceNote: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-orange focus:border-transparent resize-none" placeholder="Notes from the service..." />
                  </div>

                  {/* Service History */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Service History</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {(() => {
                        const history = (selectedCustomer as ActiveCustomer).serviceHistory || [];
                        const fallback = (selectedCustomer as ActiveCustomer).lastServiceDate
                          ? [{ date: (selectedCustomer as ActiveCustomer).lastServiceDate, note: (selectedCustomer as ActiveCustomer).serviceNote || "" }]
                          : [];
                        const list = history.length > 0 ? history : fallback;
                        return list.length === 0 ? (
                          <p className="text-sm text-gray-500 py-2">No service history yet.</p>
                        ) : (
                          list.map((svc, i) => (
                            <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                              <div className="font-medium text-gray-900 shrink-0">{new Date(svc.date).toLocaleDateString()}</div>
                              <div className="text-sm text-gray-600">{svc.note || "—"}</div>
                            </div>
                          ))
                        );
                      })()}
                    </div>
                  </div>

                  {/* Add new service */}
                  <div className="border-t border-gray-200 pt-4">
                    <label className="block text-sm font-semibold mb-2 text-gray-900">Add New Service</label>
                    <div className="space-y-2">
                      <input type="date" value={newServiceDate} onChange={(e) => setNewServiceDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange focus:border-transparent" />
                      <textarea value={newServiceNote} onChange={(e) => setNewServiceNote(e.target.value)} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-orange focus:border-transparent resize-none" placeholder="Notes about this service..." />
                      <button type="button" onClick={handleAddService} disabled={!newServiceDate.trim() || addingService} className="px-4 py-2 bg-teal hover:bg-teal/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg cursor-pointer transition-colors text-sm">
                        {addingService ? "Adding..." : "Add Service"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Junk photos (potential customers only) - up to 4 from quote form */}
              {activeTab === "potential" && isPotentialCustomer(selectedCustomer) && selectedCustomer.images > 0 && (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Photos ({selectedCustomer.images} uploaded)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {((selectedCustomer as PotentialCustomer).imageUrls?.length
                      ? (selectedCustomer as PotentialCustomer).imageUrls!
                      : Array(selectedCustomer.images).fill(null)
                    ).map((url, i) => (
                      <div key={i} className="aspect-square rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-100">
                        {url ? (
                          <button
                            type="button"
                            onClick={() => setLightboxImage(url)}
                            className="w-full h-full block cursor-pointer hover:opacity-90 transition-opacity focus:ring-2 focus:ring-orange focus:ring-offset-2 rounded"
                          >
                            <img src={url} alt={`Junk photo ${i + 1}`} className="w-full h-full object-cover pointer-events-none" />
                          </button>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Click a photo to view full size.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Notes</label>
                <textarea value={editForm.notes || ""} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-orange focus:border-transparent resize-none" placeholder="Add notes..." />
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-wrap gap-3">
              <button type="button" onClick={handleDeleteCustomer} className="flex-1 min-w-[80px] px-4 py-2.5 text-red-600 hover:bg-red-100 font-semibold rounded-lg cursor-pointer transition-colors border border-red-200">Delete</button>
              {activeTab === "potential" && isPotentialCustomer(selectedCustomer) && (
                <button type="button" onClick={() => openConvertModal(selectedCustomer)} className="flex-1 min-w-[80px] px-4 py-2.5 bg-teal hover:bg-teal/90 text-white font-semibold rounded-lg cursor-pointer transition-colors shadow-sm">Convert</button>
              )}
              <button type="button" onClick={() => { setIsModalOpen(false); setSelectedCustomer(null); setNewServiceDate(""); setNewServiceNote(""); setLightboxImage(null); }} className="flex-1 min-w-[80px] px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-100 font-semibold cursor-pointer transition-colors">Cancel</button>
              <button type="button" onClick={handleUpdateCustomer} className="flex-1 min-w-[80px] px-4 py-2.5 bg-orange hover:bg-orange/90 text-white font-semibold rounded-lg cursor-pointer transition-colors shadow-sm">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Image lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
          aria-label="Close lightbox"
        >
          <img
            src={lightboxImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl font-light transition-colors cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}

      {/* Convert / Merge Modal */}
      {convertModalOpen && convertCandidate && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Convert Customer</h3>
              <p className="text-gray-600 mb-4">
                Converting <span className="font-semibold">{convertCandidate.name}</span> ({convertCandidate.email}). Choose an option:
              </p>

              {duplicateCustomers.length > 0 ? (
                <>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Possible existing customers (same email or phone):</p>
                  <div className="space-y-2 mb-4">
                    {duplicateCustomers.map((ac) => (
                      <div key={String(ac.id)} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <div className="font-semibold text-gray-900">{ac.name}</div>
                          <div className="text-sm text-gray-600">{ac.email} • {ac.phone}</div>
                        </div>
                        <button type="button" onClick={() => handleMergeWithCustomer(ac)} disabled={convertLoading} className="px-3 py-1.5 bg-teal hover:bg-teal/90 disabled:opacity-50 text-white text-sm font-semibold rounded-lg cursor-pointer transition-colors shrink-0">
                          Merge
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Or create a new customer:</p>
                </>
              ) : (
                <p className="text-sm text-gray-500 mb-4">No existing customers found with matching email or phone.</p>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => { setConvertModalOpen(false); setConvertCandidate(null); setDuplicateCustomers([]); }} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-100 font-semibold cursor-pointer transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={handleConvertToNewCustomer} disabled={convertLoading} className="flex-1 px-4 py-2.5 bg-orange hover:bg-orange/90 disabled:opacity-50 text-white font-semibold rounded-lg cursor-pointer transition-colors">
                  {convertLoading ? "Processing..." : "Convert to New Customer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
