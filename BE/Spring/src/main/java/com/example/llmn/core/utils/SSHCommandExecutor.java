package com.example.llmn.core.utils;

import com.example.llmn.core.errors.CustomException;
import com.example.llmn.core.errors.ExceptionCode;
import lombok.extern.slf4j.Slf4j;
import org.apache.sshd.client.SshClient;
import org.apache.sshd.client.channel.ClientChannel;
import org.apache.sshd.client.channel.ClientChannelEvent;
import org.apache.sshd.client.future.ConnectFuture;
import org.apache.sshd.client.session.ClientSession;
import org.apache.sshd.common.channel.PtyChannelConfiguration;
import org.apache.sshd.common.channel.PtyMode;
import redis.clients.jedis.Jedis;

import java.io.*;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.security.KeyPair;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Slf4j
public class SSHCommandExecutor {
    // 비공개
}