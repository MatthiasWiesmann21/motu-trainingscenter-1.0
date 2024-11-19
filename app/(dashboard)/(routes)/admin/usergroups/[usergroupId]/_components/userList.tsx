'use client'

import { useState, useEffect, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Loader2, Search, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguage } from '@/lib/check-language'

interface User {
  id: string
  name: string
  email: string
  isMember: boolean
}

interface UserListProps {
  initialUsers: User[]
  usergroupId: string
}

export default function UserList({ initialUsers, usergroupId }: UserListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [loading, setLoading] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<keyof User | 'isMember' | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filterByMember, setFilterByMember] = useState<boolean | null>(null)

  const usersPerPage = 10

  // Sorting logic
  const sortedUsers = useMemo(() => {
    let sorted = [...users]
    if (sortField) {
      sorted.sort((a, b) => {
        const fieldA = sortField === 'isMember' ? (a.isMember ? 1 : 0) : a[sortField] ?? ''
        const fieldB = sortField === 'isMember' ? (b.isMember ? 1 : 0) : b[sortField] ?? ''
        if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1
        if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }
    return sorted
  }, [users, sortField, sortOrder])

  // Filtering logic
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase()
    let filtered = sortedUsers.filter(
      user => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
    )
    if (filterByMember !== null) {
      filtered = filtered.filter(user => user.isMember === filterByMember)
    }
    return filtered
  }, [sortedUsers, searchTerm, filterByMember])

  const totalPages = useMemo(() => Math.ceil(filteredUsers.length / usersPerPage), [filteredUsers.length])

  const paginatedUsers = useMemo(
    () =>
      filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
      ),
    [filteredUsers, currentPage, usersPerPage]
  )

  const handleToggleMembership = async (userId: string, isMember: boolean) => {
    setLoading(userId)
    try {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, isMember: !isMember } : user
        )
      )
      const response = await fetch(`/api/profile/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usergroupId: isMember ? null : usergroupId }),
      })
      if (!response.ok) throw new Error(`Failed to update membership for user ${userId}`)
      toast.success(`User ${isMember ? 'removed from' : 'added to'} the group.`)
    } catch (error) {
      console.error(error)
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, isMember } : user
        )
      )
      toast.error("Failed to update membership status. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const handleSort = (field: keyof User | 'isMember') => {
    if (field === 'isMember') {
      setFilterByMember(filterByMember === true ? false : filterByMember === false ? null : true)
    } else {
      setSortField(field)
      setSortOrder(prevOrder => (sortField === field && prevOrder === 'asc' ? 'desc' : 'asc'))
    }
  }

  return (
    <div className="space-y-4 mt-4">
      <Header
        title="User Management"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <UserTable
        users={paginatedUsers}
        loading={loading}
        onToggleMembership={handleToggleMembership}
        sortField={sortField}
        sortOrder={sortOrder}
        filterByMember={filterByMember}
        onSort={handleSort}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsCount={filteredUsers.length}
        itemsPerPage={usersPerPage}
      />
    </div>
  )
}

function Header({
  title,
  searchTerm,
  setSearchTerm,
}: {
  title: string
  searchTerm: string
  setSearchTerm: (term: string) => void
}) {
  const currentLanguage = useLanguage()

  return (
    <div className="flex items-center justify-between">
      <div className="relative w-full">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={currentLanguage.userList_search_placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
          aria-label="Search users"
        />
      </div>
    </div>
  )
}

function UserTable({
  users,
  loading,
  onToggleMembership,
  sortField,
  sortOrder,
  filterByMember,
  onSort,
}: {
  users: User[]
  loading: string | null
  onToggleMembership: (userId: string, isMember: boolean) => Promise<void>
  sortField: keyof User | 'isMember' | null
  sortOrder: 'asc' | 'desc'
  filterByMember: boolean | null
  onSort: (field: keyof User | 'isMember') => void
}) {
  const getSortIcon = (field: keyof User | 'isMember') => {
    if (sortField !== field) return null
    return sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  const currentLanguage = useLanguage();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => onSort('name')} className="cursor-pointer">
            {currentLanguage.userList_table_header_name} {getSortIcon('name')}
          </TableHead>
          <TableHead onClick={() => onSort('email')} className="cursor-pointer">
            {currentLanguage.userList_table_header_email} {getSortIcon('email')}
          </TableHead>
          <TableHead onClick={() => onSort('isMember')} className="cursor-pointer">
            {currentLanguage.userList_table_header_membership} {getSortIcon('isMember')}
            {filterByMember !== null && <span>({filterByMember ? 'Members' : 'Non-members'})</span>}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={user.isMember}
                  onCheckedChange={() => onToggleMembership(user.id, user.isMember)}
                  disabled={loading === user.id}
                  aria-checked={user.isMember}
                  aria-label={`Toggle membership for ${user.name}`}
                />
                <span>{user.isMember ? `${currentLanguage.userlist_table_body_isMember}` : `${currentLanguage.userlist_table_body_notMember}`}</span>
                {loading === user.id && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsCount,
  itemsPerPage,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsCount: number
  itemsPerPage: number
}) {
  const start = (currentPage - 1) * itemsPerPage + 1
  const end = Math.min(currentPage * itemsPerPage, itemsCount)
  const currentLanguage = useLanguage();

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {currentLanguage.userList_pagination_showing} {start} {currentLanguage.userList_pagination_to} {end} {currentLanguage.userList_pagination_of} {itemsCount} {currentLanguage.userList_pagination_users}
      </p>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          {currentLanguage.userList_pagination_previous}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          {currentLanguage.userList_pagination_next}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
