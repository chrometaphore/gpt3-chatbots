import React, {useState, useCallback} from 'react'
import axios from 'axios'
import { Position, Badge, Paragraph, Avatar, Text, Heading, Button, TextInput, Pane, Icon, IconButton, SideSheet, Menu } from 'evergreen-ui'
import { MenuIcon } from 'evergreen-ui'
import classnames from 'classnames'
import { motion } from 'framer-motion'
const gpt3Templates = require('../data/gpt3Templates.json')
import style from './index.module.scss'


export default function Index() {

  const [gpt3TemplateName, setGpt3TemplateName] = React.useState(gpt3Templates.templates[0].name)
  const [showMenu, setShowMenu] = React.useState(false)
  const [convo,setConvo] = useState([])
  const [isSendingQuestion, setIsSendingQuestion] = useState(false)
  const [input, setInput] = useState('')

  //send request and
  //update convo accordingly
  const sendQuestion = useCallback(async () => {

    if (isSendingQuestion) return

    setIsSendingQuestion(true)
    setConvo(convo => [...convo, {from:'me', val:input}]);
    setInput('')

    let response = await axios.post(`/api/gpt3`, {question:input, gpt3TemplateName:gpt3TemplateName})

    setConvo(convo => [...convo, {from:'ai', val:response.data.gpt3}]);
    setIsSendingQuestion(false)

  }, [isSendingQuestion, input, convo])

  //switch gpt template
  const switchTemplate = useCallback((template) => {
    setConvo([])
    setInput('')
    setGpt3TemplateName(template.name)
    setShowMenu(false)
  }, [])

  //print out menu items
  const menuTemplateItem = (template, index) => {
    return (
      <Menu.Item
        onSelect={() => {switchTemplate(template)}}
        margin={24}
        className={style.menuItem}
        key={`template_${index}`}
      >
        <Heading size={500}>
          {template.name}
        </Heading>
        <Badge color="blue" marginTop={4}>
          {template.settings.engine}
        </Badge>
        <Paragraph size={300} marginTop={16}>
          {template.context}
        </Paragraph>
      </Menu.Item>
    )
  }

  //print out message items
  const messageItem = (message, index) => {
    return (
      <motion.div
        transition={{ type: "spring", stiffness: 300, duration: 0.5 }}
        initial={{ y:10 }}
        animate={{ y:0 }}
        key={`message_${index}`}
        className={classnames(style.message, `${message.from === "me" ? style.me : style.ai}`)}
      >
        <Avatar
          src={message.from === "me" ? "/me.png" : "/bot.png"}
          name={message.from}
          size={44}
          className={style.avatar}
        />
        <Pane
          background={message.from === "me" ? "gray300" : "green500"}
          display="flex"
          flexDirection="row"
          alignItems="center"
          borderRadius={12}
        >
          <Text
            marginTop={10}
            marginBottom={10}
            marginLeft={12}
            marginRight={12}
            size={500}
            dangerouslySetInnerHTML={{__html:message.val}}
          />
        </Pane>
      </motion.div>
    )
  }

  return (
    <React.Fragment>
      <style jsx global>{`
        body {
          padding:0;
          margin:0;
          height:100%;
        }
      `}</style>

      <SideSheet
        isShown={showMenu}
        onCloseComplete={() => setShowMenu(false)}
        position={Position.TOP}
      >
        <Menu>
          <Menu.Group>
            {gpt3Templates.templates.map((template,index) => menuTemplateItem(template,index))}
          </Menu.Group>
        </Menu>
      </SideSheet>

      <Pane
        className={style.navBar}
        background="white"
      >
        <IconButton
          className={style.menu}
          onClick={() => setShowMenu(!showMenu)}
          icon={MenuIcon}
        />
        <Text size={400} color="muted">
          {gpt3TemplateName}
        </Text>
      </Pane>

      <Pane
        background="gray50"
        display="flex"
        flexDirection="column"
        borderRadius={0}
        className={style.main}
      >
          {convo.map((message, index) => messageItem(message,index))}
      </Pane>

      <Pane className={style.chatBar} background="white">
        <TextInput
          flex={1}
          marginRight={8}
          name="convo-input"
          placeholder="😺 Type something"
          onChange={() => setInput(event.target.value)}
          value={input}
        />
        <Button
          appearance="primary"
          isLoading={isSendingQuestion}
          onClick={sendQuestion}
        >
          Send
        </Button>
      </Pane>

    </React.Fragment>
  )
}
