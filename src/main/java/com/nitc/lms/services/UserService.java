package com.nitc.lms.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.nitc.lms.models.User;
import com.nitc.lms.repository.UserRepository;

public class UserService {

	@Autowired
    private UserRepository UserRepo;
	
	public void updateResetPasswordToken(String token, String email) throws UsernameNotFoundException {
        User User = UserRepo.findByEmail(email);
        if (User != null) {
            User.setResetPasswordToken(token);
            UserRepo.save(User);
        } else {
            throw new UsernameNotFoundException("Could not find any User with the email " + email);
        }
    }
     
    public User getByResetPasswordToken(String token) {
        return UserRepo.findByResetPasswordToken(token);
    }
     
    public void updatePassword(User User, String newPassword) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(newPassword);
        User.setPassword(encodedPassword);
         
        User.setResetPasswordToken(null);
        UserRepo.save(User);
    }
}
