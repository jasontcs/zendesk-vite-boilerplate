
import { Accordion } from '@zendeskgarden/react-accordions';
import { Row, Col, Grid } from '@zendeskgarden/react-grid';
import { Well } from '@zendeskgarden/react-notifications';
import { IGardenTheme } from '@zendeskgarden/react-theming';
import styled from "styled-components";
import { Span } from '@zendeskgarden/react-typography';
import React from 'react';
import { zafUtil } from '../common';
import '../common/style.css'

type SpecialRequirementsProps = {
    title: string
    content: string
    important?: boolean
}

const StyledRow = styled(Row)`
& + & {
  margin-top: ${p => (p.theme as IGardenTheme).space.xs};
}
`;

const StyledSpan = styled(Span)`
& + & {
    margin-left: ${p => (p.theme as IGardenTheme).space.sm};
    margin-right: ${p => (p.theme as IGardenTheme).space.sm};
}`

export const SpecialRequirements = ({ content, title, important }: SpecialRequirementsProps) => {

    const [animated, setAnimated] = React.useState<boolean>(important ?? false)

    const onChange = () => {
        setAnimated(false)

    }

    return (
        <Grid gutters={false}>
            <StyledRow></StyledRow>
            <StyledRow>
                <Col>
                    <Well isRecessed style={{ padding: 0 }}>
                        <Accordion level={1} isBare isCompact isCollapsible defaultExpandedSections={[]} onTransitionEnd={() => zafUtil.resizeWindow()} onChange={() => onChange()}>
                            <Accordion.Section>
                                <Accordion.Header>
                                    <Accordion.Label>
                                        <StyledSpan className={animated ? 'blink_me' : undefined}>{title}</StyledSpan>
                                    </Accordion.Label>
                                </Accordion.Header>
                                <Accordion.Panel style={{ whiteSpace: "pre-wrap" }}>
                                    {content}
                                </Accordion.Panel>
                            </Accordion.Section>
                        </Accordion>
                    </Well>
                </Col>
            </StyledRow>
        </Grid>
    )
}
