import './App.css'
import React from 'react'

import { zafDomain, zafUtil } from "@app/zendesk/common";
import { OrganizationEntity, UserEntity } from "@app/zendesk/common/entity";
import { AppLoader, NoSelectRequesterLabel, TicketPanel } from '@app/zendesk/components';
import { useImportantContactAlertContext } from '@app/zendesk/components/ImportantContactAlert';

function App() {
  const { setVisible } = useImportantContactAlertContext()
  const [user, setUser] = React.useState<UserEntity | undefined>()
  const [organization, setOrganization] = React.useState<OrganizationEntity | undefined | null>()
  const [userName, setUserName] = React.useState<string | undefined>()

  var isLoading: number | undefined

  async function requesterChanged() {
    if (isLoading) return
    const ticket = await zafDomain.getCurrentTicket()
    isLoading = ticket.requester.id
    const start = performance.now();
    const { userEntity: _user, userFields, authorisedFieldKeys } = await zafDomain.getUser(ticket.requester.id)
    setUser(_user)
    if (ticket.organization?.id) {
      const { organizationEntity: _organization } = await zafDomain.getOrganization(ticket.organization.id, { userFields, authorisedFieldKeys })
      setOrganization(_organization)
    } else {
      setOrganization(null)
    }
    const patched = await zafDomain.patchUserActiveTickets(_user)
    setUser(patched)

    if (
      (user?.isVip === false || user?.isAuthorized === false) &&
      (_user.isVip || _user.isAuthorized)
    ) {
      setVisible(true)
    }

    const end = performance.now();
    if (await zafUtil.isSandbox()) {
      zafUtil.logFetchTime(start, end, 'New Ticket Sidebar')
    }
    isLoading = undefined
  }

  React.useEffect(() => {
    console.log('new_ticket_sidebar', 'useEffect')
    zafUtil.on([
      'ticket.requester.id.changed',
      'ticket.organization.changed',
    ], requesterChanged)
    return () => {
      zafUtil.off([
        'ticket.requester.id.changed',
        'ticket.organization.changed',
      ], requesterChanged)
    }
  }, [])

  function requesterNameChanged(name: string) {
    setUserName(name)
  }

  React.useEffect(() => {
    zafUtil.on([
      'ticket.requester.name.changed',
    ], requesterNameChanged)
    return () => {
      zafUtil.off([
        'ticket.requester.name.changed',
      ], requesterNameChanged)
    }
  }, [])

  React.useEffect(() => {
    zafUtil.on([
      'ticket.save',
    ], zafDomain.ticketOnSave)
    return () => {
      zafUtil.off([
        'ticket.save',
      ], zafDomain.ticketOnSave)
    }
  }, [])

  React.useEffect(() => {
    zafUtil.resizeWindow()
  })

  if (!user || !organization) return (
    <NoSelectRequesterLabel />
  )
  return (
    <>
      {
        userName || user || organization
          ? <TicketPanel
            userName={userName}
            user={user}
            organization={organization}
          />
          : <AppLoader />
      }
    </>
  )
}

export default App
