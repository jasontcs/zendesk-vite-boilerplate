import React from "react";
import './App.css'
import zafClient from "@app/zendesk/sdk";

import { zafDomain, zafUtil } from "@app/zendesk/common";
import { OrganizationEntity, UserEntity } from "@app/zendesk/common/entity";

import { GetTicketResponse } from '@app/zendesk/common/api_model';
import { AppLoader, TicketPanel } from '@app/zendesk/components';
import { useImportantContactAlertContext } from "@app/zendesk/components/ImportantContactAlert";

function App() {
  const [user, setUser] = React.useState<UserEntity | undefined>()
  const [organization, setOrganization] = React.useState<OrganizationEntity | undefined>()
  const { setVisible } = useImportantContactAlertContext()

  const fetchAll = async () => {
    const start = performance.now();
    const { ticket }: GetTicketResponse = await zafClient.get("ticket");
    if (!ticket) zafUtil.showToast('Cannot fetch ticket, Please refresh', 'error')
    const _user = await zafDomain.getUser(ticket.requester.id)
    setUser(_user)
    zafUtil.resizeWindow()
    const _organization = await zafDomain.getOrganization(_user.organizationId)
    setOrganization(_organization)
    zafUtil.resizeWindow()

    if (
      (!user?.isVip || !user?.isAuthorized) &&
      (_user.isVip || _user.isAuthorized)
    ) {
      setVisible(true)
    }
    zafUtil.resizeWindow()
    const end = performance.now();
    if (await zafUtil.isSandbox()) {
      zafUtil.logFetchTime(start, end)
    }
  };

  React.useEffect(() => {
    fetchAll();
    zafUtil.on([
      'app.activated',
    ], fetchAll)
  }, []);

  return (
    <>
      {
        user && organization
          ? <TicketPanel
            user={user}
            organization={organization}
          ></TicketPanel>
          : <AppLoader></AppLoader>
      }
    </>
  )
}

export default App
