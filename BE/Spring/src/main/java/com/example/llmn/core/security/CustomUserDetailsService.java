package com.example.llmn.core.security;

import com.example.llmn.domain.User;
import com.example.llmn.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public CustomUserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> userOP = userRepository.findByEmail(email);

        if (userOP.isEmpty()) {
            return null;
        } else {
            User userPS = userOP.get();
            return new CustomUserDetails(userPS);
        }
    }
}
