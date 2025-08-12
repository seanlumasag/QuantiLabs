package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.StrategyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final StrategyRepository strategyRepository;

    public UserService(UserRepository userRepository, StrategyRepository strategyRepository) {
        this.userRepository = userRepository;
        this.strategyRepository = strategyRepository;
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User createUser(String username) {
        User newUser = new User();
        newUser.setUsername(username);
        return userRepository.save(newUser);
    }

    @Transactional
    public boolean deleteUserByUsername(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return false;
        }
        User user = userOpt.get();
        strategyRepository.deleteByUserId(user.getId());
        userRepository.delete(user);
        return true;
    }
}
